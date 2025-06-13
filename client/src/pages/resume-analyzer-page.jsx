import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';

import { Badge } from '@/components/ui/badge'; // Add this import
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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

import { User, Briefcase, Building2, MapPin, Star, Globe, BookText, Languages, ChevronDown, ChevronUp, Filter, Settings2 } from 'lucide-react';

const inputIcons = {
  name: <User className="w-5 h-5 text-blue-500" />,
  jobTitle: <Briefcase className="w-5 h-5 text-indigo-500" />,
  department: <Building2 className="w-5 h-5 text-teal-500" />,
  experience: <Star className="w-5 h-5 text-amber-500" />,
  location: <MapPin className="w-5 h-5 text-rose-500" />,
  skills: <Star className="w-5 h-5 text-emerald-500" />,
  education: <BookText className="w-5 h-5 text-purple-500" />,
  industry: <Globe className="w-5 h-5 text-sky-500" />,
  languages: <Languages className="w-5 h-5 text-orange-500" />,
};

const StunningInput = ({ label, placeholder, name, control }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md">
        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
          {inputIcons[name.split('.').pop()]}
          {label}
        </FormLabel>
        <FormControl>
          <Input
            placeholder={placeholder}
            {...field}
            className={`
              mt-2 px-4 py-3 w-full rounded-lg bg-white border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
              text-gray-800 placeholder-gray-400 transition-all
            `}
          />
        </FormControl>
        <FormMessage className="text-xs text-rose-500 mt-1" />
      </FormItem>
    )}
  />
);

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

  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const reanalysisId = params.get('reanalysis');

    if (reanalysisId) {
      const analyses = JSON.parse(sessionStorage.getItem('analyses') || '[]');
      const analysis = analyses.find(a => a.id === parseInt(reanalysisId));

      if (analysis) {
        setIsReanalysis(true);
        setOriginalAnalysis(analysis);
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

  const onSubmit = async (data) => {
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
      localStorage.setItem('data', JSON.stringify(data));

      const formData = new FormData();
      formData.append('job_description', data?.jobDescription);
      formData.append('resumes_zip_file', uploadedFiles?.[0]);

      const url = 'https://rayappan.pythonanywhere.com/api/';
      const res = await fetch(`${url}`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'omit',
      });

      const response = await res.json();
      setAnalysisResults(response);
      if (response) {
        setIsLoading(false);
        navigate('/results');
      }
    } catch (e) {
      console.log(e);
      setAnalysisResults({ candidates: dummyCandidates });
      navigate('/results');
      setIsLoading(false);
    }
  };

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <PageContainer>
      {isLoading && <Loader />}

      <div className="w-full py-6">
        <div className="mx-auto max-w-6xl bg-gradient-to-br from-white to-gray-50 backdrop-blur-lg shadow-xl rounded-3xl border border-gray-100 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Accordion type="multiple" collapsible defaultValue={['current-form', 'resume-upload']}>
                {/* Current Form Accordion */}
                <AccordionItem value="current-form">
                  <AccordionTrigger>
                    <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <User className="w-6 h-6 text-blue-500" />
                      Basic Info
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6"> {/* Added vertical spacing */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <StunningInput
                          label="Analysis Name"
                          placeholder="e.g. React Developer"
                          name="name"
                          control={form.control}
                        />
                        <StunningInput
                          label="Job Title"
                          placeholder="e.g. Frontend Developer"
                          name="jobTitle"
                          control={form.control}
                        />
                      </div>
                      <StunningInput
                        label="Department (optional)"
                        placeholder="e.g. Engineering"
                        name="department"
                        control={form.control}
                      />
                      <FormField
                        control={form.control}
                        name="jobDescription"
                        render={({ field }) => (
                          <FormItem className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <FormControl>
                              <JobDescriptionInput field={field} onChange={field?.onChange} />
                            </FormControl>
                            <FormMessage className="text-xs text-rose-500 mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Advanced Options Accordion */}
                <AccordionItem value="advanced-options">
                  <AccordionTrigger>
                    <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <Filter className="w-6 h-6 text-green-500" />
                      Advanced Analysis
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 animate-fade-in">
                      <div className="grid md:grid-cols-3 gap-6">
                        {['experience', 'location', 'skills', 'education', 'industry', 'languages'].map((key) => (
                          <StunningInput
                            key={key}
                            label={capitalize(key)}
                            placeholder={`Filter by ${key}`}
                            name={`filters.${key}`}
                            control={form.control}
                          />
                        ))}
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        {['prioritySkills', 'priorityExperience', 'priorityEducation'].map((key) => (
                          <FormField
                            key={key}
                            control={form.control}
                            name={`filters.${key}`}
                            render={({ field }) => (
                              <FormItem className="bg-white/90 rounded-xl border border-gray-200 p-4 shadow-sm">
                                <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                                  {key.includes('Skills') && <Star className="w-5 h-5 text-emerald-500" />}
                                  {key.includes('Experience') && <Star className="w-5 h-5 text-amber-500" />}
                                  {key.includes('Education') && <BookText className="w-5 h-5 text-purple-500" />}
                                  {key.replace('priority', 'Priority ')}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="rounded-lg border-gray-300">
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="high">High Priority</SelectItem>
                                    <SelectItem value="regular">Regular Priority</SelectItem>
                                    <SelectItem value="low">Low Priority</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Resume Upload Accordion */}
                <AccordionItem value="resume-upload">
                  <AccordionTrigger>
                    <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                      <User className="w-6 h-6 text-indigo-500" />
                      Resume Upload
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="border border-blue-100 bg-blue-50/50 overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold text-gray-800">Resume Upload</CardTitle>
                              <p className="text-sm text-gray-500">Upload resumes in PDF or ZIP format</p>
                            </div>
                          </div>
                          {uploadedFiles.length > 0 && (
                            <Badge variant="outline" className="bg-white text-blue-600 border-blue-200">
                              {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} selected
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ResumeDropzone
                          files={uploadedFiles}
                          setUploadProgress={setUploadProgress}
                          setFiles={setUploadedFiles}
                        />
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-base font-medium rounded-xl shadow-lg transition-all hover:shadow-xl"
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