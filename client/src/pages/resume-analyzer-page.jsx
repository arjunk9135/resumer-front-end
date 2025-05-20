import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';

import PageContainer from '@/components/layout/page-container';
import ResumeDropzone from '@/components/resume-analyzer/resume-dropzone';
import JobDescriptionInput from '@/components/resume-analyzer/job-description-input';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { dummyData } from '../lib/dummy';
import { useMyContext } from '../hooks/use-context'
import LoaderOverlay from '../components/ui/loader-overlay';

// Form schema based on the analysis requirements
const analysisFormSchema = z.object({
  name: z.string().min(3, "Analysis name must be at least 3 characters"),
  jobTitle: z.string().min(3, "Job title must be at least 3 characters"),
  department: z.string().optional(),
  jobDescription: z.string().min(20, "Job description must be at least 20 characters"),
  filters: z.object({
    experience: z.string().optional(),
    location: z.string().optional(),
    skills: z.string().optional(),
    education: z.string().optional(),
    industry: z.string().optional(),
    languages: z.string().optional(),
    prioritySkills: z.string().optional(),
    priorityExperience: z.string().optional(),
    priorityEducation: z.string().optional(),
  }).optional(),
});

const StunningInput = ({ label, placeholder, name, control }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="bg-white/70 rounded-3xl border p-5 shadow-inner">
        <FormLabel className="text-gray-700 font-medium">{label}</FormLabel>
        <FormControl>
          <Input
            placeholder={placeholder}
            {...field}
            className="mt-2 rounded-full px-4 py-2 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);



export default function ResumeAnalyzerPage() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [location, navigate] = useLocation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isReanalysis, setIsReanalysis] = useState(false);
  const [originalAnalysis, setOriginalAnalysis] = useState(null);
  const { toast } = useToast();
  const { analysisResults, setAnalysisResults } = useMyContext();
  const [isLoading, setIsLoading] = useState(false);

  // Check if this is a reanalysis by extracting the ID from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const reanalysisId = params.get('reanalysis');

    if (reanalysisId) {
      // Get analyses from sessionStorage
      const analyses = JSON.parse(sessionStorage.getItem('analyses') || '[]');
      const analysis = analyses.find(a => a.id === parseInt(reanalysisId));

      if (analysis) {
        setIsReanalysis(true);
        setOriginalAnalysis(analysis);

        // Prefill form with original analysis data
        form.reset({
          name: `${analysis.name} (Reanalysis)`,
          jobTitle: analysis.jobTitle,
          department: analysis.department,
          jobDescription: analysis.jobDescription,
          filters: analysis.filters || {
            experience: '',
            location: '',
            skills: '',
            education: '',
            industry: '',
            languages: '',
            prioritySkills: 'regular',
            priorityExperience: 'regular',
            priorityEducation: 'regular',
          }
        });
      }
    }
  }, [location]);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      name: '',
      jobTitle: '',
      department: '',
      jobDescription: '',
      filters: {
        experience: '',
        location: '',
        skills: '',
        education: '',
        industry: '',
        languages: '',
        prioritySkills: 'regular',
        priorityExperience: 'regular',
        priorityEducation: 'regular',
      },
    },
  });

  // Create analysis mutation - modified to work without backend
  const createAnalysisMutation = useMutation({
    mutationFn: async (data) => {
      // Simulate API call with 1 second delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a random ID for the analysis
      const analysisId = Math.floor(Math.random() * 10000) + 1;

      // Create a mock analysis object
      const analysis = {
        id: analysisId,
        ...data,
        createdById: 1,
        status: 'processing',
        candidateCount: uploadedFiles.length,
        averageScore: 0,
        createdAt: new Date().toISOString()
      };

      // Store in sessionStorage to persist through page navigation
      const analyses = JSON.parse(sessionStorage.getItem('analyses') || '[]');
      analyses.push(analysis);
      sessionStorage.setItem('analyses', JSON.stringify(analyses));

      // Generate notifications
      const notification = {
        id: Math.floor(Math.random() * 10000) + 1,
        userId: 1,
        title: 'Analysis Started',
        message: `Your analysis "${data.name}" is now processing.`,
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: analysisId,
        relatedType: 'analysis'
      };

      const notifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
      notifications.push(notification);
      sessionStorage.setItem('notifications', JSON.stringify(notifications));

      return analysis;
    },
    onSuccess: (data) => {
      toast({
        title: 'Analysis created',
        description: 'Your resume analysis has been started',
      });

      // Simulate starting the analysis process
      simulateAnalysisProgress(data.id);

      // Navigate to the results page directly for testing
      setTimeout(() => {
        navigate('/results');
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'There was an error creating your analysis',
        variant: 'destructive',
      });
    },
  });

  // Mock function to simulate the analysis progress with tiered results
  const simulateAnalysisProgress = async (analysisId) => {
    try {
      // Generate mock candidates based on uploaded files
      if (uploadedFiles.length > 0) {
        // Create a range of scores to simulate a realistic distribution
        const generateTieredScore = (index, total) => {
          // Top 10% get exceptional scores (90-98)
          if (index < total * 0.1) {
            return Math.floor(Math.random() * 8) + 90;
          }
          // Next 20% get strong scores (80-89)
          else if (index < total * 0.3) {
            return Math.floor(Math.random() * 9) + 80;
          }
          // Middle 30% get average scores (70-79)
          else if (index < total * 0.6) {
            return Math.floor(Math.random() * 9) + 70;
          }
          // Next 30% get below average scores (60-69)
          else if (index < total * 0.9) {
            return Math.floor(Math.random() * 9) + 60;
          }
          // Bottom 10% get poor scores (50-59)
          else {
            return Math.floor(Math.random() * 9) + 50;
          }
        };

        // Shuffle the files to randomize who gets what tier
        const shuffledFiles = [...uploadedFiles].sort(() => Math.random() - 0.5);

        const mockCandidates = shuffledFiles.map((file, index) => {
          // Calculate the score based on position in the array
          const matchScore = generateTieredScore(index, uploadedFiles.length);

          // Determine tier based on score
          let tier;
          if (matchScore >= 90) tier = 'exceptional';
          else if (matchScore >= 80) tier = 'strong';
          else if (matchScore >= 70) tier = 'qualified';
          else if (matchScore >= 60) tier = 'potential';
          else tier = 'notRecommended';

          return {
            id: Math.floor(Math.random() * 10000) + index + 1,
            analysisId,
            name: file.name.split('.')[0].replace(/_/g, ' '),
            email: `${file.name.split('.')[0].toLowerCase().replace(/_/g, '.')}@example.com`,
            phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            location: ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX'][Math.floor(Math.random() * 4)],
            experience: `${Math.floor(Math.random() * 8) + 1}.${Math.floor(Math.random() * 9)} years`,
            education: ['Bachelor', 'Master', 'PhD'][Math.floor(Math.random() * 3)],
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Cloud'].slice(0, Math.floor(Math.random() * 4) + 2),
            matchScore,
            tier,
            resumeText: 'Resume content would be here in a real application',
            createdAt: new Date().toISOString()
          };
        });

        // Store candidates in sessionStorage
        const candidates = JSON.parse(sessionStorage.getItem('candidates') || '[]');
        sessionStorage.setItem('candidates', JSON.stringify([...candidates, ...mockCandidates]));

        // Update analysis status to completed after 2 seconds
        setTimeout(() => {
          const analyses = JSON.parse(sessionStorage.getItem('analyses') || '[]');
          const updatedAnalyses = analyses.map(a => {
            if (a.id === analysisId) {
              // Calculate average score
              const avgScore = Math.round(mockCandidates.reduce((acc, c) => acc + c.matchScore, 0) / mockCandidates.length);
              return { ...a, status: 'completed', averageScore: avgScore };
            }
            return a;
          });
          sessionStorage.setItem('analyses', JSON.stringify(updatedAnalyses));

          // Add completion notification
          const notifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
          const completionNotification = {
            id: Math.floor(Math.random() * 10000) + 100,
            userId: 1,
            title: 'Analysis Complete',
            message: `Your analysis with ${mockCandidates.length} candidate(s) is now ready to view.`,
            type: 'success',
            isRead: false,
            createdAt: new Date().toISOString(),
            relatedId: analysisId,
            relatedType: 'analysis'
          };
          notifications.push(completionNotification);
          sessionStorage.setItem('notifications', JSON.stringify(notifications));

          // Force refresh to show the notification
          queryClient.invalidateQueries();
        }, 2000);
      }
    } catch (error) {
      console.error('Error simulating analysis progress:', error);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    console.log('here')
    if (uploadedFiles.length === 0) {
      toast({
        title: 'Missing resumes',
        description: 'Please upload at least one resume to analyze',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true); // Show loader
    try {
      console.log('Data', data, uploadedFiles)
      const formData = new FormData();
      formData.append('job_description', data?.jobDescription);
      formData.append('resumes_zip_file', uploadedFiles?.[0]);

      // const url='http://127.0.0.1:8000/api/';
      const url = 'https://rayappan.pythonanywhere.com/api/'
      // const url ='http://localhost:3001/api/'

      const res = await fetch(`${url}`, {
        method: 'POST',
        body: formData,
        mode: 'cors', // Explicitly enable CORS
        credentials: 'omit' // Change to 'include' if you need cookies
        // Headers are not needed when using FormData - 
        // the browser will automatically set the correct Content-Type with boundary
      });
      const _res = dummyData;
      const response = await res.json();
      console.log('Res', response)
      setAnalysisResults(response);
      if (response) {
        setIsLoading(false);
        navigate('/results');
      }
    } catch (e) {
      console.log(e)
      setIsLoading(false);
    }

    // createAnalysisMutation.mutate(data);
  };

  const handleUploadToDB = () => {
  // Your logic to send uploadedFiles to the DB
  console.log("Uploading files to DB...", uploadedFiles);
  // Call your API or function here
};


  return (
   <PageContainer>
  {isLoading && <LoaderOverlay />}

<div className="w-full py-0">
    <div className="mx-auto max-w-6xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-[32px] border border-gray-200 p-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">Resume Analyzer</h1>
      <p className="text-gray-500 text-lg mb-8">Upload resumes and match them with job descriptions in style.</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <StunningInput label="Analysis Name" placeholder="e.g. React Developer" name="name" control={form.control} />
            <StunningInput label="Job Title" placeholder="e.g. Frontend Developer" name="jobTitle" control={form.control} />
          </div>

          <StunningInput label="Department (optional)" placeholder="e.g. Engineering" name="department" control={form.control} />

          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem className="bg-white/60 rounded-3xl border p-6 shadow-inner">
                <FormLabel className="text-lg text-gray-700">Job Description</FormLabel>
                <FormControl>
                  <JobDescriptionInput field={field} onChange={field?.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-blue-50/70 border border-dashed border-blue-400 rounded-3xl p-6">
            <ResumeDropzone
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              setUploadProgress={setUploadProgress}
              setFiles={setUploadedFiles}
              
            />
          </div>

          {uploadedFiles?.length > 0 && (
  <div className="mt-4 max-h-60 overflow-y-auto rounded-xl border p-4 bg-white shadow">
    <h3 className="text-lg font-semibold mb-2 text-gray-700">Uploaded Resumes</h3>
    <ul className="space-y-2">
      {uploadedFiles?.map((file, idx) => (
        <li key={idx} className="text-sm text-gray-800 truncate border-b pb-1">
          📄 {file?.name}
        </li>
      ))}
    </ul>
  </div>
)}

          <div className="text-right">
            <button
              type="button"
              className="text-sm font-medium text-blue-700 hover:underline transition-all"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </button>
          </div>

          {showAdvancedFilters && (
            <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
              {['experience', 'location', 'skills', 'education', 'industry', 'languages'].map((key) => (
                <StunningInput
                  key={key}
                  label={capitalize(key)}
                  placeholder={`Filter by ${key}`}
                  name={`filters.${key}`}
                  control={form.control}
                />
              ))}

              {['prioritySkills', 'priorityExperience', 'priorityEducation'].map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={`filters.${key}`}
                  render={({ field }) => (
                    <FormItem className="bg-white/60 rounded-2xl border p-4 shadow-sm">
                      <FormLabel className="text-gray-700 font-medium">
                        {key.replace('priority', 'Priority ')}
                      </FormLabel>
                      <FormControl>
                        <Select 
                        // onValueChange={field.onChange} 
                        value={field?.value}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 text-lg rounded-full shadow-lg transition-all"
            >
              🚀 Start Analysis
            </Button>
          </div>
        </form>
      </Form>
    </div>
  </div>
</PageContainer>




  );
}
