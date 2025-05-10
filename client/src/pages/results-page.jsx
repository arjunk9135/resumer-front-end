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

export default function ResultsPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [sortType, setSortType] = useState('match');
  const {analysisResults,setAnalysisResults} = useMyContext();
  
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
  
  // If no analysis is selected or found
  if (!currentAnalysis) {
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
  
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-text">Analysis Results</h1>
          <div className="flex space-x-2">
            <Button 
              variant="default" 
              onClick={() => navigate(`/resume-analyzer?reanalysis=${currentAnalysis.id}`)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              Rescan Analysis
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        {/* Results Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-semibold text-text">{currentAnalysis.jobTitle}</h2>
                <p className="text-gray-500 mt-1">
                  {currentAnalysis.department || 'No Department'} • Created {new Date(currentAnalysis.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="flex items-center bg-gray-100 rounded-md px-3 py-1 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="text-gray-700 font-medium">{currentAnalysis.candidateCount} Candidates</span>
                </div>
                <Select value={sortType} onValueChange={setSortType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by: Match Score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Sort by: Match Score</SelectItem>
                    <SelectItem value="experience">Sort by: Experience</SelectItem>
                    <SelectItem value="education">Sort by: Education</SelectItem>
                    <SelectItem value="name">Sort by: Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Analytics Overview */}
        <AnalyticsOverview 
          candidates={candidates} 
          loading={candidatesLoading} 
        />
        
        {/* Top Candidates Section */}
        {!candidatesLoading && candidates.length > 0 && (
          <TopCandidates candidates={candidates} />
        )}
        
        {/* Charts Row */}
        <Charts 
          candidates={analysisResults?.candidates || candidates}
          loading={candidatesLoading}
        />
        
        {/* Tiered Candidates Section */}
        {!candidatesLoading && candidates.length > 0 && (
          <TieredCandidates candidates={candidates} />
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
