import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, FileArchive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const zipTypes = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream'
];

export default function ResumeDropzone({ files, setFiles, onUploadProgress }) {
  const [dragActive, setDragActive] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(
      file =>
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ...zipTypes
        ].includes(file.type) ||
        file.name.endsWith('.zip')
    );

    const newFiles = validFiles.filter(
      file => !files.some(f => f.name === file.name && f.size === file.size)
    );

    if (newFiles.length === 0) return;

    if (newFiles.length > 10) {
      const totalFiles = newFiles.length;
      let processedCount = 0;

      const processNextBatch = (startIndex) => {
        const batchSize = 5;
        const endIndex = Math.min(startIndex + batchSize, totalFiles);
        const currentBatch = newFiles.slice(startIndex, endIndex);

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
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  }, [setFiles, onUploadProgress, files]);

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
    maxSize: 10485760 * 2, // 20MB
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    multiple: true,
  });

  const getFileIcon = (fileType, name) => {
    if (
      zipTypes.includes(fileType) ||
      name.endsWith('.zip')
    ) {
      return <FileArchive className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />;
    }
    return <FileText className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />;
  };

// ...existing code...
return (
  <div className="space-y-5 w-full">
    {/* Full-width Dropzone */}
    <div
      {...getRootProps()}
      className={`
        flex flex-col p-2 items-center justify-center
        min-h-[140px] w-full
        rounded-lg bg-white border border-indigo-200
        transition-all duration-200
        ${dragActive || isDragActive ? 'border-indigo-400 bg-indigo-50/60' : 'hover:border-indigo-300'}
        cursor-pointer
        shadow
      `}
      style={{ outline: 'none' }}
    >
      <Upload className="h-7 w-7 text-indigo-400 mb-2" />
      <p className="text-base font-semibold text-gray-800 mb-1">Upload Resumes</p>
      <p className="text-xs text-gray-500 mb-2">Drag & drop or</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full px-4 py-1 bg-white hover:bg-indigo-50 hover:text-black-500 text-indigo-600 font-medium border border-indigo-200"
        onClick={open}
      >
        <Upload className="h-4 w-4 mr-1 text-indigo-400" />
        Browse Files
      </Button>
      <input {...getInputProps()} />
      <p className="text-xs text-gray-400 mt-3">
        PDF, DOC, DOCX, ZIP up to 20MB (max 200 files)
      </p>
    </div>

    {/* Uploaded Files List */}
    {files?.length > 0 && (
      <div className="w-full mt-2 grid gap-2 grid-cols-1 sm:grid-cols-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-indigo-50/40 rounded px-3 py-2 border border-indigo-100"
          >
            <div className="flex items-center overflow-hidden">
              {getFileIcon(file.type, file.name)}
              <span className="truncate font-medium text-indigo-900 text-xs">{file.name}</span>
              <span className="ml-2 text-gray-400 text-xs">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-red-500"
              onClick={() => removeFile(index)}
              aria-label="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    )}

    {/* Progress Bar */}
    {batchProgress > 0 && (
      <div className="w-full mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Processing batch</span>
          <span>{batchProgress}%</span>
        </div>
        <Progress value={batchProgress} className="h-1.5" />
      </div>
    )}

    {/* File count and clear all */}
    {files?.length > 0 && (
      <div className="w-full flex items-center mt-1">
        <span className="text-xs text-indigo-700 font-medium">
          {files.length} file{files.length !== 1 ? 's' : ''} selected
        </span>
        <Button variant="link" onClick={() => setFiles([])} className="text-xs ml-2 p-0 h-auto text-indigo-500">
          Clear all
        </Button>
      </div>
    )}
  </div>
);
// ...existing code...
}