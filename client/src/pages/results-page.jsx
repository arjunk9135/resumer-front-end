import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import {
  Download,
  Share2
} from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import AnalyticsOverview from '@/components/results/analytics-overview-new';
import CandidatesTable from '@/components/results/candidates-table';
import Charts from '@/components/results/charts';
import TopCandidates from '@/components/results/top-candidates';
import TieredCandidates from '@/components/results/tiered-candidates';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMyContext } from '../hooks/use-context';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import the default function
import {
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Chartv2 from '../components/ui/chartv2';

export default function ResultsPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [sortType, setSortType] = useState('match');
  const { analysisResults, setAnalysisResults } = useMyContext();

  console.log('analysisResults', analysisResults);

  // Mock fetch analyses from sessionStorage
  const { data: analyses = [] } = useQuery({
    queryKey: ['/api/analyses'],
    queryFn: () => {
      // Get analyses from sessionStorage
      const storedAnalyses = JSON.parse(sessionStorage.getItem('analyses') || '[]');
      return storedAnalyses;
    }
  });

  // Find the current analysis or use the first completed one
  const currentAnalysis = id
    ? analyses.find(a => a.id === parseInt(id))
    : analyses.find(a => a.status === 'completed') || analyses[0];

  // If no ID was provided but we found a completed analysis, update the URL
  useEffect(() => {
    if (!id && currentAnalysis) {
      navigate(`/results/${currentAnalysis.id}`);
    }
  }, [id, currentAnalysis, navigate]);

  // Get candidates from sessionStorage
  const {
    data: candidates = [],
    isLoading: candidatesLoading
  } = useQuery({
    queryKey: ['/api/analyses', currentAnalysis?.id, 'candidates'],
    enabled: !!currentAnalysis?.id,
    queryFn: () => {
      // Get candidates from sessionStorage
      const storedCandidates = JSON.parse(sessionStorage.getItem('candidates') || '[]');
      const filteredCandidates = storedCandidates.filter(c => c.analysisId === currentAnalysis.id);
      return filteredCandidates;
    }
  });


  // Handle export click
  const handleExport = () => {
    toast({
      title: 'Export started',
      description: 'Your data is being prepared for download.'
    });

    // In a real app, this would call an API to generate and download the export
    setTimeout(() => {
      toast({
        title: 'Export ready',
        description: 'Your data has been exported successfully.'
      });
    }, 2000);
  };

  // Handle share click
  const handleShare = () => {
    toast({
      title: 'Share results',
      description: 'A shareable link has been copied to your clipboard.'
    });
  };

  const exportToExcel = () => {
  if (!analysisResults?.candidates || analysisResults.candidates.length === 0) {
    toast({
      title: 'Export Failed',
      description: 'No candidate data available to export.',
      variant: 'destructive'
    });
    return;
  }

  try {
    const excelData = analysisResults.candidates.map(candidate => ({
      Name: candidate?.name || 'N/A',
      Email: candidate?.email || 'N/A',
      Contact: candidate?.contact || 'N/A',
      Experience: candidate?.experience || 'N/A',
      Location: candidate?.location || 'N/A',
      Skills: Array.isArray(candidate?.skills) ? candidate.skills.join(', ') : 'N/A',
      Education: candidate?.education || 'N/A',
      'Match Score': candidate?.evaluation?.overall?.score ?? 'N/A',
      'Skills Match': candidate?.evaluation?.skills_match?.score ?? 'N/A',
      'Experience Match': candidate?.evaluation?.relevant_experience?.score ?? 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    const jobTitle = currentAnalysis?.jobTitle || 'analysis';
    const safeFilename = `candidates_${jobTitle.replace(/[/\\?%*:|"<>]/g, '_')}.xlsx`;

    XLSX.writeFile(workbook, safeFilename);

    toast({
      title: 'Excel Exported',
      description: 'Candidate data has been successfully exported to Excel.'
    });
  } catch (error) {
    console.error('Excel export failed:', error);
    toast({
      title: 'Export Failed',
      description: 'An error occurred while exporting to Excel.',
      variant: 'destructive'
    });
  }
};


  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      const doc = new jsPDF();
      autoTable(doc, {
        head: [['Name', 'Score']],
        body: candidates.map(c => [c.name, c.score]),
      });
      doc.save('results.pdf');

      doc.setFontSize(18);
      doc.text(`Candidate Analysis: ${currentAnalysis?.jobTitle || 'Untitled'}`, 14, 15);
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

      const pdfData = analysisResults?.candidates?.map(candidate => [
        candidate.name || 'N/A',
        candidate.email || 'N/A',
        candidate.contact || 'N/A',
        candidate.experience || 'N/A',
        candidate.evaluation?.overall?.score || 'N/A'
      ]) || [];

      doc.autoTable({
        head: [['Name', 'Email', 'Contact', 'Experience', 'Match Score']],
        body: pdfData,
        startY: 30
      });

      doc.save(`candidates_${currentAnalysis?.jobTitle?.replace(/[/\\?%*:|"<>]/g, '-') || 'analysis'}.pdf`);

      toast({
        title: 'PDF exported',
        description: 'Candidate data has been exported to PDF.'
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: 'Export failed',
        description: 'Error exporting to PDF',
        variant: 'destructive'
      });
    }
  };

  // If no analysis is selected or found  
  if (analysisResults?.candidates <= 0) {
    return (
      <PageContainer title="Analysis Results">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-4">No analysis results found</h2>
          <p className="text-gray-500 mb-6">Start a new analysis to see results here</p>
          <Button onClick={() => navigate('/resume-analyzer')}>
            Start New Analysis
          </Button>
        </div>
      </PageContainer>
    );
  }

  console.log('localStorage?.getItem(data)', JSON.parse(localStorage?.getItem('data')));

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-text">Analysis Results</h1>
          <div className="flex space-x-2">
            {/* <Button
              variant="default"
              onClick={() => navigate(`/resume-analyzer?reanalysis=${currentAnalysis.id}`)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              Rescan Analysis
            </Button> */}
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

        {/* Results Header */}
        {/* Results Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{currentAnalysis?.jobTitle || JSON.parse(localStorage?.getItem('data'))?.jobTitle
                }</h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Job ID: {currentAnalysis?.jobId || 'JD-2023-0042'} • {currentAnalysis?.candidateCount || '0'} candidates analyzed
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Status Pill */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentAnalysis?.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : currentAnalysis?.status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                  {currentAnalysis?.status === 'completed' ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </>
                  ) : currentAnalysis?.status === 'processing' ? (
                    <>
                      <svg className="w-4 h-4 mr-1 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Processing
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Pending
                    </>
                  )}
                </div>

                <Select value={sortType} onValueChange={setSortType}>
                  <SelectTrigger className="w-[180px] bg-white border-gray-300">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Match Score</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Overview */}
        <AnalyticsOverview
          candidates={analysisResults?.candidates}
          loading={candidatesLoading}
        />

        {/* Top Candidates Section */}
        {!candidatesLoading && candidates.length > 0 && (
          <TopCandidates candidates={candidates} />
        )}

        {/* Charts Row */}
        <Chartv2
          candidates={analysisResults?.candidates}
          loading={candidatesLoading}
        />

        {/* Tiered Candidates Section */}
        {!candidatesLoading && analysisResults?.candidates?.length > 0 && (
          <TieredCandidates candidates={analysisResults?.candidates} />
        )}

        {/* Candidates Table */}
        <CandidatesTable
          candidates={analysisResults?.candidates || candidates}
          loading={candidatesLoading}
          sortType={sortType}
        />
      </div>
    </PageContainer>
  );
}
