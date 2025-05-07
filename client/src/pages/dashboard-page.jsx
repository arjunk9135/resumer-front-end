import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

import PageContainer from '@/components/layout/page-container';
import StatsCard from '@/components/dashboard/stats-card';
import RecentAnalysesTable from '@/components/dashboard/recent-analyses-table';
import InProgressCard from '@/components/dashboard/in-progress-card';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default function DashboardPage() {
  // Fetch analyses data
  const { data: analyses = [] } = useQuery({
    queryKey: ['/api/analyses'],
  });
  
  // Filter analyses by status
  const completedAnalyses = analyses.filter(a => a.status === 'completed');
  const inProgressAnalyses = analyses.filter(a => a.status === 'processing' || a.status === 'queued');
  
  // Calculate stats
  const totalAnalyses = analyses.length;
  const totalCandidates = analyses.reduce((sum, analysis) => sum + analysis.candidateCount, 0);
  const queuedAnalyses = analyses.filter(a => a.status === 'queued').length;
  
  const averageScores = completedAnalyses.filter(a => a.averageScore !== null).map(a => a.averageScore);
  const avgMatchScore = averageScores.length > 0 
    ? (averageScores.reduce((sum, score) => sum + score, 0) / averageScores.length).toFixed(1) 
    : '-';
  
  return (
    <PageContainer title="Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Analyses"
          value={totalAnalyses}
          change={{ value: "14%", direction: "up", text: "from last month" }}
          icon="file-list"
          color="primary"
        />
        
        <StatsCard
          title="Candidates Processed"
          value={totalCandidates}
          change={{ value: "7%", direction: "up", text: "from last month" }}
          icon="user-search"
          color="secondary"
        />
        
        <StatsCard
          title="In Queue"
          value={queuedAnalyses}
          change={{ value: queuedAnalyses > 0 ? `${queuedAnalyses} new` : "0 new", text: "in the last 24h" }}
          icon="time"
          color="accent"
        />
        
        <StatsCard
          title="Avg Match Score"
          value={`${avgMatchScore}%`}
          change={{ value: "2.3%", direction: "up", text: "from last week" }}
          icon="award"
          color="primary"
        />
      </div>

      {/* Recent Activity and Upcoming Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="px-6 py-5 border-b border-gray-100">
              <CardTitle className="font-display font-semibold text-lg text-text">Recent Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RecentAnalysesTable analyses={completedAnalyses.slice(0, 4)} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="px-6 py-5 border-b border-gray-100">
              <CardTitle className="font-display font-semibold text-lg text-text">In Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {inProgressAnalyses.length > 0 ? (
                inProgressAnalyses.slice(0, 3).map(analysis => (
                  <InProgressCard key={analysis.id} analysis={analysis} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No analyses in progress</p>
                  <Link href="/resume-analyzer">
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Start New Analysis
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
