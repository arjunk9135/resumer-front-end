import React, { useState } from "react";
import ResultsSection from "../components/results/results-section";
import PageContainer from "@/components/layout/page-container";
import ResumeAnalyzerSection from "../components/resume-analyzer/resume-analyzer-section";


const statusStyles = {
  "in progress": "bg-yellow-100 text-yellow-800",
  "failed": "bg-red-100 text-red-800",
  "complete": "bg-green-100 text-green-800",
  "initiated": "bg-blue-100 text-blue-800",
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
  { value: "all", label: "All", icon: (
    <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  ) },
  { value: "software engineer", label: "Software Engineer", icon: (
    <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V6a4 4 0 00-8 0v1M3 7h18M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7"/>
    </svg>
  ) },
  { value: "data scientist", label: "Data Scientist", icon: (
    <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06A1.65 1.65 0 0015 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 008.6 15a1.65 1.65 0 00-1.82-.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0015 8.6a1.65 1.65 0 001.82.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 15z"/>
    </svg>
  ) },
  { value: "product manager", label: "Product Manager", icon: (
    <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8"/>
    </svg>
  ) },
  { value: "qa engineer", label: "QA Engineer", icon: (
    <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4"/>
    </svg>
  ) },
];

const ResultsPage = () => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);

  

  const handleCardClick = (result) => setSelectedResult(result);
  const handleBackClick = () => {
    setSelectedResult(null);
    setMenuOpen(null);
  };
  const handleMenuToggle = (id) => setMenuOpen(menuOpen === id ? null : id);
  const handleView = (result) => {
    setSelectedResult(result);
    setMenuOpen(null);
  };
  const handleDelete = (id) => {
    setMenuOpen(null);
  };

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
      {selectedResult ? (
        <div>
          <button
            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors mb-4"
            onClick={handleBackClick}
          >
            ← Back to All Results
          </button>
          <ResultsSection result={selectedResult} />
        </div>
      ) : (
        <div>
          {/* Title and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-3xl font-bold text-left mb-4 sm:mb-0 text-blue-900">Analysis Queue</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              <div className="flex items-center bg-white/60 backdrop-blur-md border border-blue-100 rounded-lg px-2 py-1 shadow">
                <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search analysis..."
                  className="bg-transparent outline-none px-2 py-1 text-blue-900 placeholder-blue-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-white/60 backdrop-blur-md border border-blue-100 rounded-lg px-4 py-2 pr-8 text-blue-900 shadow focus:ring-2 focus:ring-blue-200"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {filterOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="relative bg-gradient-to-br from-blue-50/70 via-white/60 to-purple-100/70 rounded-2xl shadow-xl p-5 hover:scale-105 transition-transform cursor-pointer border border-blue-100 backdrop-blur-lg"
                style={{
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
                  border: "1px solid rgba(173, 216, 230, 0.25)",
                }}
                onClick={() => handleCardClick(result)}
              >
                {/* Status Chip */}
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow ${statusStyles[result.status] || "bg-gray-200 text-gray-700"}`}
                >
                  {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                      {result.analysisName}
                    </h3>
                    <div className="flex items-center mb-2">
                      {/* Bag Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-blue-400 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7V6a4 4 0 00-8 0v1M3 7h18M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7"
                        />
                      </svg>
                      <p className="text-blue-800">Job Title: {result.jobTitle}</p>
                    </div>
                    <div className="flex items-center">
                      {/* Grid Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 text-blue-400 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v18m9-9H3"
                        />
                      </svg>
                      <p className="text-blue-500">Analysis ID: {result.analysisId}</p>
                    </div>
                  </div>
                  {/* Eye Icon & Menu */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button
                      className="text-blue-800 hover:text-blue-400"
                      onClick={() => handleMenuToggle(result.id)}
                    >
                      {/* Eye Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                        />
                      </svg>
                    </button>
                    {menuOpen === result.id && (
                      <div className="absolute right-0 mt-2 bg-white border border-blue-100 rounded-lg shadow-lg z-10">
                        <button
                          className="block px-4 py-2 text-blue-900 hover:bg-blue-50 w-full text-left"
                          onClick={() => handleView(result)}
                        >
                          View
                        </button>
                        <button
                          className="block px-4 py-2 text-red-600 hover:bg-blue-50 w-full text-left"
                          onClick={() => handleDelete(result.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ResumeAnalyzerSection />
    </PageContainer>
  );
};

export default ResultsPage;