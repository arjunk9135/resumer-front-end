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
      {/* Recent Activity and Upcoming Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left part: Recent Analyses - spans 2 columns */}
        <div className="lg:col-span-2 flex flex-col">
          <div
            className="flex flex-col bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl
                 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-grow"
            style={{ minHeight: '400px' }}
          >
            <header className="px-8 py-6 border-b border-white/30">
              <h2 className="font-display font-semibold text-2xl text-gray-800 select-none">
                Recent Analysis Results
              </h2>
            </header>
            <main className="flex-grow p-6 overflow-auto">
              <RecentAnalysesTable analyses={completedAnalyses.slice(0, 4)} />
            </main>
          </div>
        </div>

        {/* Right part: In Progress - single column */}
        <div className="flex flex-col">
          <div
            className="flex flex-col bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl
                 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-grow"
            style={{ minHeight: '400px' }}
          >
            <header className="px-8 py-6 border-b border-white/30">
              <h2 className="font-display font-semibold text-2xl text-gray-800 select-none">
                In Progress
              </h2>
            </header>
            <main className="flex-grow p-6 space-y-5 overflow-auto">
              {inProgressAnalyses.length > 0 ? (
                inProgressAnalyses.slice(0, 3).map(analysis => (
                  <InProgressCard key={analysis.id} analysis={analysis} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center flex-grow text-gray-600 text-center">
                  <p className="mb-6 text-base font-medium select-none">No analyses in progress</p>
                  <Link href="/resume-analyzer" passHref>
                    <a>
                      <button
                        style={{
                          backgroundColor:'#d7e0f66e',
                          boxShadow:
                            "0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                        }}
                        className="inline-flex items-center px-5 py-3 bg-white/30 hover:bg-white/50 text-gray-800 font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Start New Analysis
                      </button>

                    </a>
                  </Link>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>



    </PageContainer>
  );
}
