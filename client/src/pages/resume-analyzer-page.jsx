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
import { dummyCandidates } from '../components/ui/dummyData';
import Loader from '../components/ui/Loader/Loader';

import { User, Briefcase, Building2, MapPin, Star, Globe, BookText, Languages } from 'lucide-react'; // Place at the top of your file

const inputIcons = {
  name: <User className="w-5 h-5 text-blue-400" />,
  jobTitle: <Briefcase className="w-5 h-5 text-indigo-400" />,
  department: <Building2 className="w-5 h-5 text-gray-400" />,
  experience: <Star className="w-5 h-5 text-yellow-400" />,
  location: <MapPin className="w-5 h-5 text-pink-400" />,
  skills: <Star className="w-5 h-5 text-green-400" />,
  education: <BookText className="w-5 h-5 text-purple-400" />,
  industry: <Globe className="w-5 h-5 text-blue-400" />,
  languages: <Languages className="w-5 h-5 text-orange-400" />,
};

const StunningInput = ({ label, placeholder, name, control }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="bg-white/60 backdrop-blur-md rounded-2xl border border-blue-100 p-4 shadow-lg transition-all hover:shadow-xl">
        <FormLabel className="text-gray-700 font-semibold mb-1">{label}</FormLabel>
        <FormControl>
          <div className="relative">
            {inputIcons[name.split('.').pop()] && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                {inputIcons[name.split('.').pop()]}
              </span>
            )}
            <Input
              placeholder={placeholder}
              {...field}
              className={`
                mt-2 pl-12 pr-4 py-2 w-full rounded-full bg-white/80 border border-blue-200
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                text-gray-800 placeholder-gray-400 shadow-inner transition-all
              `}
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

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
    setIsLoading(true); 
    try {
      console.log('Data', data, uploadedFiles)
      localStorage.setItem('data', JSON.stringify(data));
      //for testing 
      // setAnalysisResults({
      //   candidates : dummyCandidates
      // })
      //  navigate('/results');

      const formData = new FormData();
      formData.append('job_description', data?.jobDescription);
      formData.append('resumes_zip_file', uploadedFiles?.[0]);
        
      // const url='http://127.0.0.1:8000/api/';
      const url = 'https://rayappan.pythonanywhere.com/api/'
      // const url ='http://localhost:3001/api/'


      // setAnalysisResults({
      //   candidates : dummyCandidates
      // })
      //  navigate('/results');

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
      setAnalysisResults({
        candidates : dummyCandidates
      })
       navigate('/results');
      setIsLoading(false);
    }

    // createAnalysisMutation.mutate(data);
  };

  const handleUploadToDB = () => {
  // Your logic to send uploadedFiles to the DB
  console.log("Uploading files to DB...", uploadedFiles);
  // Call your API or function here
};

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

  return (
   <PageContainer>
  {isLoading && <Loader />}

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
                {/* <FormLabel className="text-lg text-gray-700">Job Description</FormLabel> */}
                <FormControl>
                  <JobDescriptionInput field={field} onChange={field?.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-blue-50/70 border border-grey-400 rounded-3xl p-6">
            <ResumeDropzone
              files={uploadedFiles}
              setUploadProgress={setUploadProgress}
              setFiles={setUploadedFiles}
              
            />
          </div>

          

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
               Start Analysis
            </Button>
          </div>
        </form>
      </Form>
    </div>
  </div>
</PageContainer>




  );
}
