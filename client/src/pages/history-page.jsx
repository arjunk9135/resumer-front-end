import React, { useState, useEffect } from "react";
import PageContainer from "@/components/layout/page-container";
import ResultsSection from "../components/results/results-section";
import { customFetch } from "../utils/api";
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import dayjs from "dayjs";

const URL = import.meta.env.VITE_GW;

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
  COMPLETE: "bg-green-100 text-green-800",
  INITIATED: "bg-blue-100 text-blue-800",
};

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [batches, setBatches] = useState([]);
    const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    getBatches();
  }, []);

  const fetchToken = async () => {
    return await getToken();
  };

  const getBatches = async () => {
    setIsLoading(true);
    const _token = await fetchToken();
    try {
      const data = await customFetch(`${URL}/batches/`, {
        method: "GET",
        token: _token,
        includeAuth: true,
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

  const getResult=async(id)=>{
   setIsLoading(true);
    const _token = await fetchToken();
    try {
      const data = await customFetch(`${URL}/batches/${id}`, {
        method: "GET",
        token: _token,
        includeAuth: true,
      });
      if (data) {
        // setBatches(data);
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
  }

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.job_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
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
              placeholder="Search job title or ID..."
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
              <option value="all">All</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="COMPLETE">Complete</option>
              <option value="INITIATED">Initiated</option>
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
        <div className="rounded-2xl bg-gradient-to-br from-blue-50/70 via-white/60 to-purple-100/70 border border-blue-100 shadow-xl backdrop-blur-lg">
          <table className="min-w-full divide-y divide-blue-100">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Batch ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-blue-400">No batches found.</td>
                </tr>
              ) : (
                filteredBatches.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/40 transition cursor-pointer"
                    onClick={() => getResult(row?.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-blue-900 font-medium">{row.job_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${statusStyles[row.status] || "bg-gray-200 text-gray-700"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                      {dayjs(row.created_at).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                      {row.processed_resumes}/{row.total_resumes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-blue-600 hover:text-blue-900 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHistory(row);
                        }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
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
