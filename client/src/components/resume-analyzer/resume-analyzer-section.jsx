import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMyContext } from "../../hooks/use-context";
import { motion } from "framer-motion";

import Loader from "../ui/Loader/Loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "../ui/progress";

import ResumeDropzone from "./resume-dropzone";
import JobDescriptionInput from "./job-description-input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import {
  User,
  Briefcase,
  Building2,
  MapPin,
  Star,
  Globe,
  BookText,
  Languages,
  Filter,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { dummyCandidates } from "../ui/dummyData";
import { customFetch } from "../../utils/api";
import { useAuth } from "@clerk/clerk-react";

// const URL = import.meta.env.VITE_GW;
const URL = 'http://127.0.0.1:8000'


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
  filters: z
    .object({
      experience: z.string().optional(),
      location: z.string().optional(),
      skills: z.string().optional(),
      education: z.string().optional(),
      industry: z.string().optional(),
      languages: z.string().optional(),
      prioritySkills: z.string().optional(),
      priorityExperience: z.string().optional(),
      priorityEducation: z.string().optional(),
    })
    .optional(),
});

const StunningInput = ({ label, placeholder, name, control, disabled }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem
        className={`bg-white/70 backdrop-blur-lg rounded-xl border border-blue-100 p-4 shadow-sm transition-all hover:shadow-md ${disabled ? "opacity-60 pointer-events-none" : ""
          }`}
      >
        <FormLabel className="text-blue-900 font-medium flex items-center gap-2">
          {inputIcons[name.split(".").pop()]}
          {label}
        </FormLabel>
        <FormControl>
          <Input
            placeholder={placeholder}
            {...field}
            disabled={disabled}
            className="mt-2 px-4 py-3 w-full rounded-lg bg-white/80 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-blue-900 placeholder-blue-400 transition-all"
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
  const { analysisResults, setAnalysisResults, batchDetails, setBatchDetails } = useMyContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [batchId, setBatchId] = useState(null);
  const { isSignedIn, getToken } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadDone, setIsUploadDone] = useState(false);

  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);


  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'
  const [currentUploadedFile, setCurrentUploadedFile] = useState(null);

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

  // ✅ Auto populate form if batchDetails exists
  useEffect(() => {
    if (batchDetails && batchDetails.id && !isSaved) {
      // Map job_name to both jobTitle and name fields
      form.setValue("name", batchDetails.job_name || "");
      form.setValue("jobTitle", batchDetails.job_name || "");
      form.setValue("department", batchDetails.department || "");
      form.setValue("jobDescription", batchDetails.job_description || "");
      setIsSaved(true);
      setBatchId(batchDetails.id);
    }
  }, [batchDetails, form, isSaved]);

  useEffect(() => {
    const zip = uploadedFiles.find((f) => f.name.endsWith(".zip"));
    if (zip && (!currentUploadedFile || zip.name !== currentUploadedFile.name)) {
      uploadZipToDMS(zip);
    }
  }, [uploadedFiles]); // Removed currentUploadedFile from dependencies

  const fetchToken = async () => {
    const token = await getToken();
    return token;
  };

  const onSave = async () => {
    const valid = await form.trigger(["name", "jobTitle", "department", "jobDescription"]);
    if (!valid) return;

    const values = form.getValues();
    const formData = new FormData();
    formData.append("job_name", values.jobTitle);
    formData.append("job_description", values.jobDescription);

    const _token = await fetchToken();

    try {
      const res = await customFetch(`${URL}/batches/`, {
        method: "POST",
        body: formData,
        stringifyBody: false,
        credentials: "omit",
        token: _token,
        includeAuth: false,
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

  const uploadZipToDMS = async (zipFile) => {
    // Don't proceed if we're already uploading this file
    if (currentUploadedFile && zipFile.name === currentUploadedFile.name && uploadStatus === 'uploading') {
      return;
    }

    setShowUploadModal(true);
    setUploadProgress(0);
    setIsUploadDone(false);
    setUploadStatus('uploading');
    setCurrentUploadedFile(zipFile);

    const formData = new FormData();
    formData.append("file", zipFile);
    formData.append("batch_id", batchId || "");

    try {
      const _token = await fetchToken();
      const xhr = new XMLHttpRequest();

      xhr.open("POST", `${URL}/batches/upload/`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${_token}`);

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadProgress(100);
          setUploadStatus('success');
          setIsUploadDone(true);

          // Only update uploadedFiles if this is still the current file
          setUploadedFiles(prev => {
            const current = prev.find(f => f.name === zipFile.name);
            return current ? [zipFile] : prev;
          });
        } else {
          setUploadStatus('error');
          toast({
            title: "Upload Failed",
            description: "Something went wrong with the document upload.",
            variant: "destructive",
          });
        }
      };

      xhr.onerror = () => {
        setUploadStatus('error');
        toast({
          title: "Network Error",
          description: "Couldn't reach upload server.",
          variant: "destructive",
        });
      };

      xhr.send(formData);
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    }
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
      const _token = await fetchToken();
      const submissionData = batchDetails ? {
        ...data,
        name: batchDetails.job_name || data.name,
        jobTitle: batchDetails.job_name || data.jobTitle,
        jobDescription: batchDetails.job_description || data.jobDescription
      } : data;

      localStorage.setItem("data", JSON.stringify(submissionData));

      const formData = new FormData();

      const payload = {
        "batch_id": batchId || "",
      }
      const url = batchDetails ? `${URL}/analyze/` : `${URL}/analyze/`;

      const res = await customFetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        stringifyBody: false,
        credentials: "omit",
        token: _token,
        includeAuth: true,
      });

      if (res) {
        setAnalysisResults(res);
        setIsLoading(false);

        // Show popup
        setShowAnalysisPopup(true);
        let timeLeft = 5;
        const timer = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          if (timeLeft === 0) {
            clearInterval(timer);
            navigate("/dashboard");
          }
        }, 1000);
      }

    } catch (e) {
      console.error("Analysis failed:", e);
      setAnalysisResults({ candidates: dummyCandidates });
      navigate("/results");
      setIsLoading(false);
      toast({
        title: "Analysis Error",
        description: e.message || "Something went wrong during analysis",
        variant: "destructive",
      });
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
      
      <Dialog
  open={showUploadModal}
  onOpenChange={(open) => {
    if (!open && (uploadStatus === "success" || uploadStatus === "error")) {
      setShowUploadModal(false);
    }
  }}
>
  <DialogContent className="max-w-md rounded-3xl border border-[#E4E6F5] bg-white shadow-xl px-6 py-8">
    <div className="text-center space-y-4">
      {/* Title */}
      <h2 className="text-xl font-bold text-[#2B265E]">
        {uploadStatus === "uploading"
          ? "Uploading Document"
          : uploadStatus === "success"
          ? "Upload Complete"
          : "Upload Failed"}
      </h2>

      {/* Uploading */}
      {uploadStatus === "uploading" && (
        <>
          <div className="w-full">
            <div className="w-full bg-[#F4F7FE] rounded-full h-2 mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.6, type: "spring" }}
                className="h-2 rounded-full bg-gradient-to-r from-[#7B8CFF] to-[#5B6CFF]"
              />
            </div>
            <p className="text-sm text-gray-500 mt-3">{uploadProgress}% uploaded</p>
            <p className="text-sm text-gray-600">{currentUploadedFile?.name}</p>
          </div>
        </>
      )}

      {/* Success */}
      {uploadStatus === "success" && (
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
          <p className="text-gray-600 text-sm">Document successfully attached!</p>
          <Button
            onClick={() => setShowUploadModal(false)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl shadow hover:from-blue-700 hover:to-indigo-700"
          >
            Done
          </Button>
        </div>
      )}

      {/* Error */}
      {uploadStatus === "error" && (
        <div className="flex flex-col items-center space-y-4">
          <XCircle className="h-12 w-12 text-red-500" />
          <p className="text-gray-600 text-sm">
            Something went wrong during the upload. Please try again.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => uploadZipToDMS(currentUploadedFile)}
              className="bg-gradient-to-r from-red-500 to-rose-500 text-white shadow"
            >
              Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>


      <Dialog open={showAnalysisPopup} onOpenChange={() => {}}>
  <DialogContent className="max-w-md rounded-3xl bg-white/70 backdrop-blur-lg border border-blue-200 shadow-2xl">
    <DialogHeader>
      <DialogTitle className="text-center text-2xl font-bold text-blue-900">
         Analysis Started!
      </DialogTitle>
    </DialogHeader>

    <div className="flex flex-col items-center text-center space-y-4 py-6">
      <p className="text-blue-800 text-md">
        Your resumes are being analyzed. Results will be available shortly.
      </p>
      <div className="text-lg font-semibold text-indigo-700 animate-pulse">
        Redirecting to Dashboard in {countdown}...
      </div>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
}