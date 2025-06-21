import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useParams, useLocation } from 'wouter';
import {
  Download, Share2, FileSpreadsheet, FileText
} from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import AnalyticsOverview from '@/components/results/analytics-overview-new';
import CandidatesTable from '@/components/results/candidates-table';
import Charts from '@/components/results/charts';
import TopCandidates from '@/components/results/top-candidates';
import TieredCandidates from '@/components/results/tiered-candidates';

import { Card, CardContent, Button } from '@/components/ui';
import { useToast } from '@/hooks/use-toast';
import { useMyContext } from '../../hooks/use-context';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Chartv2 from '../../components/ui/chartv2';

export default function ResultsSection() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [sortType, setSortType] = useState('match');
  const { analysisResults } = useMyContext();

  const candidates = analysisResults?.results || [];

  const currentAnalysis = {
    id: analysisResults?.id,
    jobTitle: analysisResults?.job_name,
    candidateCount: analysisResults?.total_resumes,
    status: analysisResults?.status
  };

  const handleExport = () => {
    toast({ title: 'Export started', description: 'Your data is being prepared for download.' });
    setTimeout(() => {
      toast({ title: 'Export ready', description: 'Your data has been exported successfully.' });
    }, 2000);
  };

  const exportToExcel = () => {
    if (!candidates.length) {
      toast({ title: 'Export Failed', description: 'No candidate data available to export.', variant: 'destructive' });
      return;
    }

    const excelData = candidates.map(candidate => ({
      Name: candidate.candidate_name || 'N/A',
      Email: candidate.email || 'N/A',
      Contact: candidate.contact || 'N/A',
      Experience: candidate.experience || 'N/A',
      Location: candidate.location || 'N/A',
      Skills: candidate.skills || 'N/A',
      Education: candidate.education || 'N/A',
      'Match Score': candidate.evaluation?.overall?.score ?? 'N/A',
      'Skills Match': candidate.evaluation?.skills_match?.score ?? 'N/A',
      'Experience Match': candidate.evaluation?.relevant_experience?.score ?? 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    const safeFilename = `candidates_${(currentAnalysis?.jobTitle || 'analysis').replace(/[/\\?%*:|"<>]/g, '_')}.xlsx`;
    XLSX.writeFile(workbook, safeFilename);

    toast({ title: 'Excel Exported', description: 'Candidate data has been successfully exported to Excel.' });
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [['Name', 'Email', 'Contact', 'Experience', 'Match Score']],
        body: candidates.map(c => [
          c.candidate_name,
          c.email,
          c.contact,
          c.experience,
          c.evaluation?.overall?.score
        ])
      });
      doc.save(`candidates_${(currentAnalysis?.jobTitle || 'analysis').replace(/[/\\?%*:|"<>]/g, '-')}.pdf`);

      toast({ title: 'PDF exported', description: 'Candidate data has been exported to PDF.' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: 'Export failed', description: 'Error exporting to PDF', variant: 'destructive' });
    }
  };

  if (!candidates.length) {
    return (
      <>
        {!candidates.length && (
          <div className="flex flex-col items-center justify-center py-12 bg-white/60 backdrop-blur-md rounded-xl border border-blue-100 shadow-md">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">No Analysis Results</h2>
            <p className="text-sm text-blue-700 mb-4">
              Start a new analysis to view candidate matches.
            </p>
            <button
              className="mt-4 sm:mt-0 bg-gradient-to-r from-[#7B8CFF] to-[#5B6CFF] hover:from-[#6F7FEF] hover:to-[#4B5CFF] text-white px-6 py-2 rounded-xl shadow-lg font-semibold transition-all"
              onClick={() => navigate('/results')}
            >
              + Start New Analysis
            </button>
          </div>)}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-text">Analysis Results</h1>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>Export as Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="p-6 rounded-3xl from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
          <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentAnalysis?.jobTitle || 'Untitled Role'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Job ID: {currentAnalysis?.id?.slice(0, 8) || 'Unknown'} • {currentAnalysis?.candidateCount} candidates analyzed
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                currentAnalysis?.status === 'COMPLETED'
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              )}>
                {currentAnalysis?.status}
              </span>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <AnalyticsOverview candidates={candidates} loading={false} />
      <TopCandidates candidates={candidates} />
      <Chartv2 candidates={candidates} loading={false} />
      <TieredCandidates candidates={candidates} />
      <CandidatesTable candidates={candidates} loading={false} sortType={sortType} />
    </div>
  );
}
