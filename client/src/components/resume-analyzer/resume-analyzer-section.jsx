import { useState , useEffect} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMyContext } from "../../hooks/use-context";
import Loader from "../ui/Loader/Loader";
import ResumeDropzone from "./resume-dropzone";
import JobDescriptionInput from "./job-description-input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { User, Briefcase, Building2, MapPin, Star, Globe, BookText, Languages, Filter } from "lucide-react";
import { Badge } from "../ui/badge";
import { dummyCandidates } from "../ui/dummyData";
import { customFetch } from "../../utils/api";
import { useAuth } from '@clerk/clerk-react';

const URL = import.meta.env.VITE_GW;

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

const StunningInput = ({ label, placeholder, name, control, disabled }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={`bg-white/70 backdrop-blur-lg rounded-xl border border-blue-100 p-4 shadow-sm transition-all hover:shadow-md ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
        <FormLabel className="text-blue-900 font-medium flex items-center gap-2">
          {inputIcons[name.split('.').pop()]}
          {label}
        </FormLabel>
        <FormControl>
          <Input
            placeholder={placeholder}
            {...field}
            disabled={disabled}
            className={`
              mt-2 px-4 py-3 w-full rounded-lg bg-white/80 border border-blue-100
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
              text-blue-900 placeholder-blue-400 transition-all
            `}
          />
        </FormControl>
        <FormMessage className="text-xs text-rose-500 mt-1" />
      </FormItem>
    )}
  />
);

export default function ResumeAnalyzerSection({ onCancel }) {
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { setAnalysisResults } = useMyContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [batchId, setBatchId] = useState(null);
  const { isSignedIn, getToken } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadDone, setIsUploadDone] = useState(false);


  const fetchToken = async () => {
    const token = await getToken();
    return token
  };

  const form = useForm({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      name: "",
      jobTitle: "",
      department: "",
      jobDescription: "",
      filters: {
        experience: "",
        location: "",
        skills: "",
        education: "",
        industry: "",
        languages: "",
        prioritySkills: "regular",
        priorityExperience: "regular",
        priorityEducation: "regular",
      },
    },
  });

  const onSave = async () => {
    const valid = await form.trigger(["name", "jobTitle", "department", "jobDescription"]);
    if (!valid) return;


    const values = form.getValues();
    const formData = new FormData();
    formData.append("job_name", values.jobTitle);
    formData.append("job_description", values.jobDescription);

    const _token = await fetchToken();

    console.log('_token', _token);

    try {
      const res = await customFetch(`${URL}/batches/`, {
        method: "POST",
        body: formData,
        stringifyBody: false,
        credentials: 'omit',
        token: _token, // Pass the token directly
        includeAuth: false, // will include Clerk JWT token automatically
      });

      if (res) {
        setIsSaved(true);
        setBatchId(res?.id);
        toast({
          title: "Saved!",
          description: "Basic info saved. You can now add filters and upload resumes.",
          variant: "success",
        });
      }

    } catch (error) {
      console.error("Save failed:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong while saving.",
        variant: "destructive",
      });
    }
  };

useEffect(() => {
    const zip = uploadedFiles.find((f) => f.name.endsWith(".zip"));
    if (zip) uploadZipToDMS(zip);
  }, [uploadedFiles]);

  const uploadZipToDMS = (zipFile) => {
    setShowUploadModal(true);
    setUploadProgress(0);
    setIsUploadDone(false);

    const formData = new FormData();
    formData.append("file", zipFile);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${URL}/dms/upload/`, true);

    xhr.upload.onprogress = (ev) =>
      ev.lengthComputable &&
      setUploadProgress(Math.round((ev.loaded / ev.total) * 100));

    xhr.onload = () => {
      if (xhr.status === 200) {
        setUploadProgress(100);
        setIsUploadDone(true);
      } else {
        toast({
          title: "Upload Failed",
          description: "Something went wrong with the ZIP upload.",
          variant: "destructive",
        });
        setShowUploadModal(false);
      }
    };

    xhr.onerror = () => {
      toast({
        title: "Network Error",
        description: "Couldn't reach upload server.",
        variant: "destructive",
      });
      setShowUploadModal(false);
    };

    xhr.send(formData);
  };


  const onSubmit = async (data) => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "Missing resumes",
        description: "Please upload at least one resume to analyze",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      localStorage.setItem("data", JSON.stringify(data));
      const formData = new FormData();
      formData.append("job_description", data?.jobDescription);
      formData.append("resumes_zip_file", uploadedFiles?.[0]);
      const url = "https://rayappan.pythonanywhere.com/api/";
      const res = await fetch(`${url}`, {
        method: "POST",
        body: formData,
        mode: "cors",
        credentials: "omit",
      });
      const response = await res.json();
      setAnalysisResults(response);
      if (response) {
        setIsLoading(false);
        navigate("/results");
      }
    } catch (e) {
      setAnalysisResults({ candidates: dummyCandidates });
      navigate("/results");
      setIsLoading(false);
    }
  };

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="w-full py-6">
      {isLoading && <Loader />}
      <div className="mx-auto w-full max-w-7xl bg-gradient-to-br from-blue-50/80 via-white/80 to-purple-100/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-blue-100 px-2 py-4 sm:px-8 sm:py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* --- Basic Info Accordion --- */}
            <Accordion type="single" collapsible defaultValue="basic-info">
              <AccordionItem value="basic-info">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 text-xl font-bold text-blue-900">
                    <User className="w-6 h-6 text-blue-500" />
                    Basic Info
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <StunningInput
                        label="Analysis Name"
                        placeholder="e.g. React Developer"
                        name="name"
                        control={form.control}
                        disabled={isSaved}
                      />
                      <StunningInput
                        label="Job Title"
                        placeholder="e.g. Frontend Developer"
                        name="jobTitle"
                        control={form.control}
                        disabled={isSaved}
                      />
                    </div>
                    <StunningInput
                      label="Department (optional)"
                      placeholder="e.g. Engineering"
                      name="department"
                      control={form.control}
                      disabled={isSaved}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* --- Job Description Accordion --- */}
            <Accordion type="single" collapsible defaultValue="job-description">
              <AccordionItem value="job-description">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 text-xl font-bold text-blue-900">
                    <BookText className="w-6 h-6 text-purple-500" />
                    Job Description
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem className="bg-white/80 rounded-2xl border border-blue-100 p-6 shadow-sm">
                        <FormControl>
                          <JobDescriptionInput field={field} onChange={field?.onChange} disabled={isSaved} />
                        </FormControl>
                        <FormMessage className="text-xs text-rose-500 mt-1" />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* --- Save Button --- */}
            {!isSaved && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-base font-medium rounded-xl shadow-lg transition-all hover:shadow-xl"
                  onClick={onSave}
                >
                  Save
                </Button>
              </div>
            )}

            {/* --- Filters Accordion --- */}
            <Accordion type="single" collapsible defaultValue={isSaved ? "filters" : undefined}>
              <AccordionItem value="filters">
                <AccordionTrigger disabled={!isSaved}>
                  <div className={`flex items-center gap-3 text-xl font-bold text-blue-900 ${!isSaved ? "opacity-60" : ""}`}>
                    <Filter className="w-6 h-6 text-green-500" />
                    Advanced Analysis
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={`space-y-6 animate-fade-in ${!isSaved ? "opacity-60 pointer-events-none" : ""}`}>
                    <div className="grid md:grid-cols-3 gap-6">
                      {["experience", "location", "skills", "education", "industry", "languages"].map((key) => (
                        <StunningInput
                          key={key}
                          label={capitalize(key)}
                          placeholder={`Filter by ${key}`}
                          name={`filters.${key}`}
                          control={form.control}
                          disabled={!isSaved}
                        />
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* --- Priority Accordion --- */}
            <Accordion type="single" collapsible defaultValue={isSaved ? "priority" : undefined}>
              <AccordionItem value="priority">
                <AccordionTrigger disabled={!isSaved}>
                  <div className={`flex items-center gap-3 text-xl font-bold text-blue-900 ${!isSaved ? "opacity-60" : ""}`}>
                    <Star className="w-6 h-6 text-amber-500" />
                    Priority
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={`space-y-6 animate-fade-in ${!isSaved ? "opacity-60 pointer-events-none" : ""}`}>
                    <div className="grid md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="filters.prioritySkills"
                        render={({ field }) => (
                          <FormItem className="bg-white/70 rounded-xl border border-blue-100 p-4 shadow-sm">
                            <FormLabel className="text-blue-900 font-medium flex items-center gap-2">
                              First Priority
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isSaved}>
                              <SelectTrigger className="rounded-lg border-blue-100">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">Location</SelectItem>
                                <SelectItem value="regular">Skills</SelectItem>
                                <SelectItem value="low">Education</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="filters.priorityExperience"
                        render={({ field }) => (
                          <FormItem className="bg-white/70 rounded-xl border border-blue-100 p-4 shadow-sm">
                            <FormLabel className="text-blue-900 font-medium flex items-center gap-2">
                              Second Priority
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isSaved}>
                              <SelectTrigger className="rounded-lg border-blue-100">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">Location</SelectItem>
                                <SelectItem value="regular">Skills</SelectItem>
                                <SelectItem value="low">Education</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="filters.priorityEducation"
                        render={({ field }) => (
                          <FormItem className="bg-white/70 rounded-xl border border-blue-100 p-4 shadow-sm">
                            <FormLabel className="text-blue-900 font-medium flex items-center gap-2">
                              Third Priority
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isSaved}>
                              <SelectTrigger className="rounded-lg border-blue-100">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">Location</SelectItem>
                                <SelectItem value="regular">Skills</SelectItem>
                                <SelectItem value="low">Education</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* --- Resume Upload Accordion (always open, cannot collapse) --- */}
            <div className="mt-6">
              <div className="flex items-center gap-3 text-xl font-bold text-blue-900 mb-4">
                <User className="w-6 h-6 text-indigo-500" />
                Resume Upload
              </div>
              <Card className={`border border-blue-100 bg-blue-50/60 overflow-hidden ${!isSaved ? "opacity-60 pointer-events-none" : ""}`}>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-blue-900">Resume Upload</CardTitle>
                        <p className="text-sm text-blue-500">Upload resumes in PDF or ZIP format</p>
                      </div>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <Badge variant="outline" className="bg-white text-blue-600 border-blue-200">
                        {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} selected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ResumeDropzone
                    files={uploadedFiles}
                    setFiles={setUploadedFiles}
                    disabled={!isSaved}
                  />
                </CardContent>
              </Card>
            </div>

            {/* --- Start Analysis Button --- */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                className="mr-4"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-base font-medium rounded-xl shadow-lg transition-all hover:shadow-xl"
                disabled={!isSaved}
              >
                Start Analysis
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}