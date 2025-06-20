import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { PlusIcon, Zap, Rocket, TrendingUp, Sparkles } from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import StatsCard from '@/components/dashboard/stats-card';
import RecentAnalysesTable from '@/components/dashboard/recent-analyses-table';
import InProgressCard from '@/components/dashboard/in-progress-card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: analyses = [] } = useQuery({ queryKey: ['/api/analyses'] });

  const completedAnalyses = analyses.filter(a => a.status === 'completed');
  const inProgressAnalyses = analyses.filter(a => a.status === 'processing' || a.status === 'queued');

  const totalAnalyses = analyses.length;
  const totalCandidates = analyses.reduce((sum, analysis) => sum + analysis.candidateCount, 0);
  const queuedAnalyses = analyses.filter(a => a.status === 'queued').length;

  const averageScores = completedAnalyses.filter(a => a.averageScore !== null).map(a => a.averageScore);
  const avgMatchScore = averageScores.length > 0
    ? (averageScores.reduce((sum, score) => sum + score, 0) / averageScores.length).toFixed(1)
    : '-';

  const successRate = ((completedAnalyses.length / Math.max(1, totalAnalyses)) * 100).toFixed(1);

  return (
    <PageContainer title="Insights Dashboard">
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <StatsCard
          title="Total Magic"
          value={totalAnalyses}
          change={{ value: "42%", direction: "up", text: "from last month" }}
          icon={<Zap className="text-yellow-400" />}
          color="primary"
        />

        <StatsCard
          title="Candidates Transformed"
          value={totalCandidates}
          change={{ value: "28%", direction: "up", text: "record high" }}
          icon={<Sparkles className="text-purple-400" />}
          color="secondary"
        />

        <StatsCard
          title="Success Rate"
          value={`${successRate}%`}
          change={{ value: "15%", direction: "up", text: "all time best" }}
          icon={<TrendingUp className="text-green-400" />}
          color="accent"
        />

        <StatsCard
          title="Peak Performance"
          value={`${avgMatchScore}%`}
          change={{ value: "9.8%", direction: "up", text: "breaking records" }}
          icon={<Rocket className="text-pink-400" />}
          color="primary"
        />
      </motion.div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Analyses */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#7B8CFF]/20 to-[#5B6CFF]/20 backdrop-blur-lg border border-[#E1E5F2]/30 rounded-3xl shadow-[0_10px_40px_rgba(123,140,255,0.2)] overflow-hidden"
          >
            <header className="px-8 py-6 border-b border-[#E1E5F2]/30 flex justify-between items-center">
              <h2 className="font-display font-bold text-2xl text-[#1F2937]">Recent Analysis</h2>
            </header>

            <main className="p-1 overflow-auto max-h-96">
              <RecentAnalysesTable 
                analyses={completedAnalyses.slice(0, 5)} 
                className="bg-transparent"
              />
            </main>
          </motion.div>
        </div>

        {/* In Progress */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#7B8CFF]/20 to-[#5B6CFF]/20 backdrop-blur-lg border border-[#E1E5F2]/30 rounded-3xl shadow-[0_10px_40px_rgba(123,140,255,0.2)] overflow-hidden h-full"
          >
            <header className="px-8 py-6 border-b border-[#E1E5F2]/30">
              <h2 className="font-display font-bold text-2xl text-[#1F2937]">
                Current Active Analyses
              </h2>
            </header>

            <main className="p-6 space-y-4">
              {inProgressAnalyses.length > 0 ? (
                inProgressAnalyses.slice(0, 3).map(analysis => (
                  <InProgressCard 
                    key={analysis.id} 
                    analysis={analysis} 
                    className="bg-white/10 hover:bg-white/20 transition-all"
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-white/10 p-4 rounded-full mb-4">
                    <Zap className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="text-gray-300 font-medium mb-6">No active analyses right now</p>
                  <Link href="/resume-analyzer">
                    <Button className="gap-2" variant="glow">
                      <PlusIcon className="h-4 w-4" />
                      Perform New Analysis
                    </Button>
                  </Link>
                </div>
              )}
            </main>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}
