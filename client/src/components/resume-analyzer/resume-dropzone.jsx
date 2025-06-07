import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, FileArchive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function ResumeDropzone({ files, setFiles, onUploadProgress }) {
  const [dragActive, setDragActive] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  
  const onDrop = useCallback((acceptedFiles) => {
    // Filter for valid file types (PDF, DOC, DOCX, and ZIP)
    const validFiles = acceptedFiles.filter(
      file => [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'application/x-zip-compressed'
      ].includes(file.type)
    );
    
    // For large batches (over 10 files), simulate progress updates
    if (validFiles.length > 10) {
      const totalFiles = validFiles.length;
      let processedCount = 0;
      
      const processNextBatch = (startIndex) => {
        const batchSize = 5;
        const endIndex = Math.min(startIndex + batchSize, totalFiles);
        const currentBatch = validFiles.slice(startIndex, endIndex);
        
        processedCount += currentBatch.length;
        const progress = Math.floor((processedCount / totalFiles) * 100);
        setBatchProgress(progress);
        
        if (onUploadProgress) {
          onUploadProgress(progress);
        }
        
        setFiles(prevFiles => [...prevFiles, ...currentBatch]);
        
        if (endIndex < totalFiles) {
          setTimeout(() => processNextBatch(endIndex), 300);
        } else {
          setBatchProgress(0);
        }
      };
      
      processNextBatch(0);
    } else {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
  }, [setFiles, onUploadProgress]);
  
  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip']
    },
    maxSize: 10485760 * 2, // 20MB (larger for ZIP files)
    noClick: false,
    noKeyboard: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });
  
  const getFileIcon = (fileType) => {
    if (fileType === 'application/zip' || fileType === 'application/x-zip-compressed') {
      return <FileArchive className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />;
    }
    return <FileText className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />;
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors
                   ${dragActive || isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 bg-white'}`}
      >
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600 justify-center">
            <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
              <span className="mr-1">Upload resumes</span>
              <input {...getInputProps()} />
            </label>
            <p>or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PDF, DOC, DOCX, or ZIP up to 20MB each (max 200 files)
          </p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
              <div className="flex items-center overflow-hidden">
                {getFileIcon(file.type)}
                <span className="truncate">{file.name}</span>
                <span className="ml-2 text-gray-400 text-xs">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-red-500"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {batchProgress > 0 && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Processing large batch upload</span>
            <span>{batchProgress}%</span>
          </div>
          <Progress value={batchProgress} className="h-2" />
        </div>
      )}
      
      {files.length > 0 && (
        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-600">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </span>
          <Button variant="link" onClick={() => setFiles([])} className="text-sm ml-2 p-0 h-auto">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}