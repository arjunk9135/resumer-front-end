import React, { useState } from "react";
import ResultsSection from "../components/results/results-section";
import PageContainer from "@/components/layout/page-container";
import ResumeAnalyzerSection from "../components/resume-analyzer/resume-analyzer-section";
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { customFetch } from "../utils/api";
import Loader from "../components/ui/Loader/Loader";
import { useLocation } from "wouter";
import { useMyContext } from "../hooks/use-context";

// const URL = import.meta.env.VITE_GW;
const URL = 'http://127.0.0.1:8000'



const statusStyles = {
  "PENDING": "bg-yellow-100 text-yellow-800",
  "FAILED": "bg-[#FEE2E2] text-[#B91C1C]",
  "COMPLETED": "bg-[#D1FAE5] text-[#065F46]",
  "initiated": "bg-[#DBEAFE] text-[#1D4ED8]",
};

const results = [
  {
    id: 1,
    analysisName: "Resume Analysis",
    jobTitle: "Software Engineer",
    analysisId: "A123",
    status: "complete",
  },
  {
    id: 2,
    analysisName: "Job Fit Analysis",
    jobTitle: "Data Scientist",
    analysisId: "B456",
    status: "in progress",
  },
  {
    id: 3,
    analysisName: "Skill Match Analysis",
    jobTitle: "Product Manager",
    analysisId: "C789",
    status: "failed",
  },
  {
    id: 4,
    analysisName: "Initial Screening",
    jobTitle: "QA Engineer",
    analysisId: "D012",
    status: "initiated",
  },
];

const filterOptions = [
  { value: "all", label: "All" },
  { value: "FAILED", label: "Failed" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" }
];

export default function ResultsPage() {
  const { getToken } = useAuth();
   const { analysisResults, setAnalysisResults ,batchDetails, setBatchDetails } = useMyContext();
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  React.useEffect(()=>{
getBatches();
  },[])

 

  const fetchToken = async () => {
    return await getToken();
  };

  const getBatches = async () => {
      setIsLoading(true);
      const _token = await fetchToken();
      try {
        const data = await customFetch(`${URL}/batches/`, {
          method: "GET",
          // token: _token,
          includeAuth: false,
        });
        if (data) {
          setBatches(data);
          console.log("Fetched Batches:", data);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast({
          title: "Error",
          description: error.message || "Something went wrong while fetching batches.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const getBatch = async (id) => {
        setIsLoading(true);
        const _token = await fetchToken();
        try {
          const data = await customFetch(`${URL}/batches/${id}`, {
            method: "GET",
            token: _token,
            includeAuth: true,
          });
          if (data) {
            console.log("Fetched Batches:", data);
            setBatchDetails(data);
            setShowAnalyzer(true);
            // navigate('/results',{state: { result: true } });
          }
        } catch (error) {
          console.error("Error fetching batches:", error);
          toast({
            title: "Error",
            description: error.message || "Something went wrong while fetching batches.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

  const filteredResults = batches.filter((result) => {
    const matchesSearch = result.job_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" || result.status.toUpperCase() === filterType;
    return matchesSearch && matchesFilter && result.status !== "COMPLETED";
  });

  const handleBack=()=>{
    setShowAnalyzer(false);
    setBatchDetails(null)
  }

  return (
    <PageContainer>
      {isLoading && <Loader />}
      {showAnalyzer && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              className="bg-[#DBEAFE] text-[#1D4ED8] px-4 py-2 rounded-lg hover:bg-[#BFDBFE] transition-colors"
              onClick={handleBack}
            >
              ← Back to Results
            </button>
          </div>
          <ResumeAnalyzerSection onCancel={() => setShowAnalyzer(false)} />
        </div>
      )}

      {/* {!showAnalyzer && selectedResult && (
        <div>
          <button
            className="bg-[#DBEAFE] text-[#1D4ED8] px-4 py-2 rounded-lg hover:bg-[#BFDBFE] transition-colors mb-4"
            onClick={() => setSelectedResult(null)}
          >
            ← Back to Results
          </button>
          <ResultsSection result={selectedResult} />
        </div>
      )} */}

      {!showAnalyzer && !selectedResult && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-left mb-4 sm:mb-0 text-[#2F49D1]">All Results</h1>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center mt-2">
                <input
                  type="text"
                  placeholder="Search by analysis name..."
                  className="border border-[#E1E5F2] rounded-lg px-4 py-2 w-full sm:w-64 text-[#2F49D1]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-[#E1E5F2] rounded-lg px-4 py-2 pr-8 text-[#2F49D1] shadow focus:ring-2 focus:ring-[#5B6CFF]/50"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    {filterOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5E75FF]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="mt-4 sm:mt-0 bg-gradient-to-r from-[#7B8CFF] to-[#5B6CFF] hover:from-[#6F7FEF] hover:to-[#4B5CFF] text-white px-6 py-2 rounded-xl shadow-lg font-semibold transition-all"
              onClick={() => setShowAnalyzer(true)}
            >
              + Start New Analysis
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="relative group overflow-hidden rounded-3xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                onClick={() => getBatch(result?.id)}
              >
                {/* Holographic shine layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B8CFF]/10 via-[#5B6CFF]/10 to-[#A9A6FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Moving shine effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-y-full -left-20 w-40 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out] transition-opacity duration-300"></div>
                </div>
                
                {/* Main card content */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-[#E1E5F2]/50 p-6 z-10 h-full">
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow ${statusStyles[result.status?.toUpperCase()] || "bg-gray-200 text-gray-700"}`}
                  >
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </span>
                  
                  <div className="flex flex-col h-full">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2F49D1] to-[#5B6CFF] mb-3">
                      {result.analysisName}
                    </h3>
                    
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg bg-[#F0F4FF] mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5 text-[#5B6CFF]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7V6a4 4 0 00-8 0v1M3 7h18M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7"
                          />
                        </svg>
                      </div>
                      <p className="text-[#4F4F74] font-medium">Job Title: <span className="text-[#2B265E]">{result.job_name?.slice(0,10)}..</span></p>
                    </div>
                    
                    <div className="flex items-center mt-auto">
                      <div className="p-2 rounded-lg bg-[#F0F4FF] mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5 text-[#5B6CFF]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v18m9-9H3"
                          />
                        </svg>
                      </div>
                      <p className="text-[#4F4F74] font-medium">Analysis ID: <span className="text-[#2B265E] font-mono">{result.id}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}