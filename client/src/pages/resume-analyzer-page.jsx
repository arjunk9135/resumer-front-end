import { useState,useEffect } from 'react';
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
  const onSubmit = async(data) => {
    if (uploadedFiles.length === 0) {
      toast({
        title: 'Missing resumes',
        description: 'Please upload at least one resume to analyze',
        variant: 'destructive',
      });
      return;
    }
    const res = true;
    if(res){
      navigate('/results');
    }
    // createAnalysisMutation.mutate(data);
  };
  
  
  return (
    <PageContainer title="Resume Analyzer">
      <Card>
        <CardHeader className="px-6 py-5 border-b border-gray-100">
          <CardTitle className="font-display font-semibold text-lg text-text">New Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Analysis Info */}
              <div className="space-y-4">
                <h3 className="font-display font-medium text-md text-text">1. Analysis Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Analysis Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior Developer Hiring Q2 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Engineering, Marketing, HR" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Step 2: Job Description */}
              <div className="space-y-4">
                <h3 className="font-display font-medium text-md text-text">2. Job Description</h3>
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <JobDescriptionInput
                        value={field.value}
                        onChange={field.onChange}
                        error={form.formState.errors.jobDescription}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Step 3: Upload Resumes */}
              <div className="space-y-4">
                <h3 className="font-display font-medium text-md text-text">
                  3. Upload Resumes
                  {isReanalysis && originalAnalysis && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (Original analysis had {originalAnalysis.candidateCount} resumes)
                    </span>
                  )}
                </h3>
                <ResumeDropzone
                  files={uploadedFiles}
                  setFiles={setUploadedFiles}
                  onUploadProgress={setUploadProgress} 
                />
                
                {/* Analysis info for large batch uploads */}
                {uploadedFiles.length > 25 && (
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-700 mt-2">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <div>
                        <p className="font-medium mb-1">Large batch processing</p>
                        <p>You've uploaded {uploadedFiles.length} resumes. Large batches will be processed in smaller groups with progress tracking.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Filtering Criteria */}
              <div className="space-y-4">
                <h3 className="font-display font-medium text-md text-text">4. Filter Criteria (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="filters.experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Any Experience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="any">Any Experience</SelectItem>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-7">5-7 years</SelectItem>
                            <SelectItem value="7+">7+ years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="filters.location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Any Location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="any">Any Location</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="europe">Europe</SelectItem>
                            <SelectItem value="asia">Asia</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="filters.skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Skills</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. React, JavaScript, Node.js" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Advanced Filters */}
                <div>
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary text-sm p-0 h-auto"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  >
                    {showAdvancedFilters ? '- Hide' : '+ Show'} Advanced Filters
                  </Button>
                  
                  {showAdvancedFilters && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="filters.education"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Education" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="any">Any Education</SelectItem>
                                <SelectItem value="high-school">High School</SelectItem>
                                <SelectItem value="associate">Associate Degree</SelectItem>
                                <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                <SelectItem value="master">Master's Degree</SelectItem>
                                <SelectItem value="phd">PhD</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="filters.industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any Industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="any">Any Industry</SelectItem>
                                <SelectItem value="tech">Technology</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="filters.languages"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Languages</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. English, Spanish, French" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                
                {/* Priority Settings */}
                <div className="mt-8 border-t pt-4">
                  <h4 className="text-md font-medium text-text mb-4">Priority Settings</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Set priority weights for different criteria to better rank candidates.
                    Higher priority items will have more impact on the candidate scoring.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="filters.prioritySkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skills Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Regular Priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="regular">Regular Priority</SelectItem>
                              <SelectItem value="low">Low Priority</SelectItem>
                              <SelectItem value="medium">Medium Priority</SelectItem>
                              <SelectItem value="high">High Priority</SelectItem>
                              <SelectItem value="critical">Critical Priority</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="filters.priorityExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Regular Priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="regular">Regular Priority</SelectItem>
                              <SelectItem value="low">Low Priority</SelectItem>
                              <SelectItem value="medium">Medium Priority</SelectItem>
                              <SelectItem value="high">High Priority</SelectItem>
                              <SelectItem value="critical">Critical Priority</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="filters.priorityEducation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Regular Priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="regular">Regular Priority</SelectItem>
                              <SelectItem value="low">Low Priority</SelectItem>
                              <SelectItem value="medium">Medium Priority</SelectItem>
                              <SelectItem value="high">High Priority</SelectItem>
                              <SelectItem value="critical">Critical Priority</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="mr-4"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={createAnalysisMutation.isPending}
                >
                  {createAnalysisMutation.isPending ? 'Starting Analysis...' : 'Start Analysis'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
