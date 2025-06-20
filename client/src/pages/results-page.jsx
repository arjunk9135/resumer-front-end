import React, { useState } from "react";
import ResultsSection from "../components/results/results-section";
import PageContainer from "@/components/layout/page-container";
import ResumeAnalyzerSection from "../components/resume-analyzer/resume-analyzer-section";

const statusStyles = {
  "in progress": "bg-yellow-100 text-yellow-800",
  "failed": "bg-[#FEE2E2] text-[#B91C1C]",
  "complete": "bg-[#D1FAE5] text-[#065F46]",
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
  { value: "software engineer", label: "Software Engineer" },
  { value: "data scientist", label: "Data Scientist" },
  { value: "product manager", label: "Product Manager" },
  { value: "qa engineer", label: "QA Engineer" },
];

export default function ResultsPage() {
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const filteredResults = results.filter((result) => {
    const matchesSearch = result.analysisName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" || result.jobTitle.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageContainer>
      {showAnalyzer && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              className="bg-[#DBEAFE] text-[#1D4ED8] px-4 py-2 rounded-lg hover:bg-[#BFDBFE] transition-colors"
              onClick={() => setShowAnalyzer(false)}
            >
              ← Back to Results
            </button>
          </div>
          <ResumeAnalyzerSection onCancel={() => setShowAnalyzer(false)} />
        </div>
      )}

      {!showAnalyzer && selectedResult && (
        <div>
          <button
            className="bg-[#DBEAFE] text-[#1D4ED8] px-4 py-2 rounded-lg hover:bg-[#BFDBFE] transition-colors mb-4"
            onClick={() => setSelectedResult(null)}
          >
            ← Back to Results
          </button>
          <ResultsSection result={selectedResult} />
        </div>
      )}

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
                className="relative bg-white rounded-lg shadow border border-[#E1E5F2] p-4 hover:scale-105 transition-transform cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow ${statusStyles[result.status] || "bg-gray-200 text-gray-700"}`}
                >
                  {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#2F49D1] mb-2">
                      {result.analysisName}
                    </h3>
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-[#2F49D1] mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7V6a4 4 0 00-8 0v1M3 7h18M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7"
                        />
                      </svg>
                      <p className="text-[#6E7B8A]">Job Title: {result.jobTitle}</p>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-[#2F49D1] mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v18m9-9H3"
                        />
                      </svg>
                      <p className="text-[#6E7B8A]">Analysis ID: {result.analysisId}</p>
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
