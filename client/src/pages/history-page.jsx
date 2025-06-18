import React, { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import ResultsSection from "../components/results/results-section";

const statusStyles = {
  "in progress": "bg-yellow-100 text-yellow-800",
  "failed": "bg-red-100 text-red-800",
  "complete": "bg-green-100 text-green-800",
  "initiated": "bg-blue-100 text-blue-800",
};

const historyData = [
  {
    id: 1,
    analysisName: "Resume Analysis",
    jobTitle: "Software Engineer",
    analysisId: "A123",
    status: "complete",
    date: "2024-06-01",
    user: "Arjun K",
    duration: "2m 30s",
    score: 92,
  },
  {
    id: 2,
    analysisName: "Job Fit Analysis",
    jobTitle: "Data Scientist",
    analysisId: "B456",
    status: "in progress",
    date: "2024-06-02",
    user: "Priya S",
    duration: "1m 10s",
    score: 78,
  },
  {
    id: 3,
    analysisName: "Skill Match Analysis",
    jobTitle: "Product Manager",
    analysisId: "C789",
    status: "failed",
    date: "2024-06-03",
    user: "Rahul M",
    duration: "0m 45s",
    score: 0,
  },
  {
    id: 4,
    analysisName: "Initial Screening",
    jobTitle: "QA Engineer",
    analysisId: "D012",
    status: "initiated",
    date: "2024-06-04",
    user: "Sneha T",
    duration: "-",
    score: null,
  },
];

const filterOptions = [
  { value: "all", label: "All" },
  { value: "complete", label: "Complete" },
  { value: "in progress", label: "In Progress" },
  { value: "failed", label: "Failed" },
  { value: "initiated", label: "Initiated" },
];

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHistory, setSelectedHistory] = useState(null);

  const filteredHistory = historyData.filter((row) => {
    const matchesSearch =
      row.analysisName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.analysisId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (selectedHistory) {
    return (
      <PageContainer>
        <button
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors mb-4"
          onClick={() => setSelectedHistory(null)}
        >
          ← Back to History
        </button>
        {/* Pass the selected history's id as a param if needed */}
        <ResultsSection result={selectedHistory} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-left mb-4 sm:mb-0 text-blue-900">History</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
          <div className="flex items-center bg-white/60 backdrop-blur-md border border-blue-100 rounded-lg px-2 py-1 shadow">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search history..."
              className="bg-transparent outline-none px-2 py-1 text-blue-900 placeholder-blue-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white/60 backdrop-blur-md border border-blue-100 rounded-lg px-4 py-2 pr-8 text-blue-900 shadow focus:ring-2 focus:ring-blue-200"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
      <div className="overflow-x-auto">
        <div
          className="rounded-2xl bg-gradient-to-br from-blue-50/70 via-white/60 to-purple-100/70 border border-blue-100 shadow-xl backdrop-blur-lg"
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
            border: "1px solid rgba(173, 216, 230, 0.25)",
          }}
        >
          <table className="min-w-full divide-y divide-blue-100">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Analysis</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Analysis ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-blue-400">No history found.</td>
                </tr>
              ) : (
                filteredHistory.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/40 transition cursor-pointer"
                    onClick={() => setSelectedHistory(row)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-blue-900 font-medium">{row.analysisName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-800">{row.jobTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-500">{row.analysisId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${statusStyles[row.status] || "bg-gray-200 text-gray-700"}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">{row.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">{row.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">{row.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">{row.score !== null ? row.score : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-900 transition"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedHistory(row);
                        }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default HistoryPage;