import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { PlusIcon, Zap, Rocket, TrendingUp, Sparkles, Award, UserCheck, Star } from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import StatsCard from '@/components/dashboard/stats-card';
import RecentAnalysesTable from '@/components/dashboard/recent-analyses-table';
import InProgressCard from '@/components/dashboard/in-progress-card';
import { Button } from '@/components/ui/button';
import SummaryGraph from '../components/dashboard/summary-graph';

// Avatar component for candidates
const Avatar = ({ name, className = '' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className={`flex items-center justify-center rounded-full bg-[#F4F7FE] text-[#2F49D1] font-medium ${className}`}>
      {initials}
    </div>
  );
};

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

  // Mock top candidates data
  const topCandidates = [
    { id: 1, name: "Alex Johnson", score: "98%", skills: ["React", "Node.js", "TypeScript"] },
    { id: 2, name: "Sarah Williams", score: "95%", skills: ["Python", "ML", "Data Analysis"] },
    { id: 3, name: "Michael Chen", score: "93%", skills: ["Java", "Spring", "Microservices"] },
  ];

  return (
    <PageContainer title="Dashboard">
      {/* Main Content Area - 80/20 Split */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Side (80%) */}
        <div className="w-full lg:w-3/5 space-y-12">
          {/* Chart at the top */}
          <div className="w-full">
            <SummaryGraph/>
          </div>

          {/* 3 Stats Cards spanning the space below */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <StatsCard
              title="Total Analyses"
              value={totalAnalyses}
              change={{ value: "42%", direction: "up", text: "from last month" }}
              icon={<Zap className="text-yellow-400" />}
              color="primary"
            />

            <StatsCard
              title="Candidates Analysed"
              value={totalCandidates}
              change={{ value: "28%", direction: "up", text: "record high" }}
              icon={<Sparkles className="text-[#5B6CFF]" />}
              color="secondary"
            />

            <StatsCard
              title="Success Rate"
              value={`${successRate}%`}
              change={{ value: "15%", direction: "up", text: "all time best" }}
              icon={<TrendingUp className="text-green-400" />}
              color="accent"
            />
          </motion.div>

          {/* Bottom Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Analyses */}
            

            {/* In Progress */}
           
          </div>
        </div>

        {/* Right Side - Top Candidates (20%) */}
        <div className="w-full lg:w-2/5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="h-full bg-white border border-[#E1E5F2] rounded-3xl shadow-sm overflow-hidden"
          >
            <header className="px-6 py-5 border-none border-[#E1E5F2] flex items-center gap-3 ">
              <Award className="h-5 w-5 text-white" />
              <h2 className="font-display font-bold text-2xl text-black">Top Candidates</h2>
            </header>

            <main className="p-4 space-y-4">
              {topCandidates.map((candidate, index) => (
                <div 
                  key={candidate.id}
                  className="bg-white hover:bg-[#F4F7FE] transition-all p-4 rounded-xl border border-[#E1E5F2] shadow-xs group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={candidate.name} className="w-10 h-10 text-sm" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                          index === 0 ? 'bg-[#44C97F]/10 text-[#44C97F]' :
                          index === 1 ? 'bg-[#2F49D1]/10 text-[#2F49D1]' :
                          'bg-[#5B6CFF]/10 text-[#5B6CFF]'
                        }`}>
                          {candidate.score}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        {index === 0 ? (
                          <Star className="h-4 w-4 text-[#44C97F] fill-[#44C97F]" />
                        ) : index === 1 ? (
                          <Star className="h-4 w-4 text-[#2F49D1] fill-[#2F49D1]" />
                        ) : (
                          <Star className="h-4 w-4 text-[#5B6CFF] fill-[#5B6CFF]" />
                        )}
                        <span className="text-xs text-[#6E7B8A] ml-1">
                          {index === 0 ? 'Top Match' : index === 1 ? 'Strong Fit' : 'Great Fit'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map(skill => (
                      <span 
                        key={skill} 
                        className="text-xs bg-[#F4F7FE] text-[#2F49D1] px-2.5 py-1 rounded-full border border-[#E1E5F2]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </main>

            <footer className="p-4 border-none border-[#E1E5F2]">
              <Button variant="outline" className="w-full gap-2 text-[#5B6CFF] hover:bg-[#F4F7FE] hover:text-[#2F49D1] border-[#E1E5F2]">
                <UserCheck className="h-3 w-4" />
                View All Candidates
              </Button>
            </footer>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}