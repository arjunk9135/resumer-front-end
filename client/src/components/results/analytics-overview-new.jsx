import { Award, BarChart2, Calendar, Wrench, ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AnalyticsOverview({ candidates, loading }) {
  // Color scheme configuration
// Define semantic color palette map
const paletteMap = {
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    text: 'text-violet-700 dark:text-violet-300',
    value: 'text-violet-900 dark:text-white',
    border: 'border-violet-200 dark:border-violet-800',
    glow: 'bg-violet-400/20',
  },
};



  // Calculate analytics metrics
  const calculateMetrics = () => {
    if (!candidates || candidates.length === 0) {
      return {
        averageScore: 0,
        top10Percent: 0,
        averageExperience: 0,
        skillsCoverage: 0,
        top10Count: 0,
        experienceLevel: 'Junior'
      };
    }
    
    const candidatesWithMatchScores = candidates.map(candidate => {
      let matchScore = 0;
      
      if (candidate.evaluation?.skills_match) {
        matchScore = (candidate.evaluation.skills_match.score / 10) * 100;
      } else if (candidate.evaluation?.overall) {
        matchScore = (candidate.evaluation.overall.score / 10) * 100;
      }
      
      return { ...candidate, matchScore };
    });
    
    const totalScore = candidatesWithMatchScores.reduce((sum, c) => sum + c.matchScore, 0);
    const averageScore = totalScore / candidates.length;
    const above90Count = candidatesWithMatchScores.filter(c => c.matchScore >= 90).length;
    const top10Percent = above90Count > 0 ? (above90Count / candidates.length) * 100 : 0;
    
    const calculateExperience = (candidate) => {
      if (typeof candidate.experience === 'number') return candidate.experience;
      if (typeof candidate.experience === 'string') {
        const match = candidate.experience.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
      }
      return 0;
    };
    
    const experienceValues = candidates.map(calculateExperience);
    const totalExperience = experienceValues.reduce((sum, v) => sum + v, 0);
    const averageExperience = totalExperience / candidates.length;
    
    let experienceLevel = 'Junior';
    if (averageExperience >= 5) experienceLevel = 'Senior';
    else if (averageExperience >= 2) experienceLevel = 'Mid-level';
    
    const maxExpectedSkills = 20;
    const skillsCounts = candidates.map(c => {
      const candidateSkills = Array.isArray(c.skills) ? c.skills : [];
      return Math.min(100, (candidateSkills.length / maxExpectedSkills) * 100);
    });
    
    const averageSkillsCoverage = skillsCounts.reduce((sum, c) => sum + c, 0) / candidates.length;
    
    return {
      averageScore: averageScore.toFixed(0),
      top10Percent: top10Percent.toFixed(0),
      averageExperience: averageExperience.toFixed(1),
      skillsCoverage: averageSkillsCoverage.toFixed(0),
      top10Count: above90Count,
      experienceLevel
    };
  };
  
  const metrics = calculateMetrics();

  // Animated Progress Bar component
  const ProgressBar = ({ value }) => (
  <div className="w-full bg-[#F4F7FE] rounded-full h-2 mt-3 overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="h-2 rounded-full bg-gradient-to-r from-[#7B8CFF] to-[#5B6CFF]"
    />
  </div>
);

  // Metric Card component
const MetricCard = ({
  title,
  value,
  description,
  icon,
  progressValue,
  extraContent
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "relative rounded-2xl p-6 border group transition-all duration-300 hover:shadow-md",
        "bg-gradient-to-br from-[#F4F3FF] to-[#E8E9FF] border-[#D8D7FF]"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#5E5BD1] mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-[#2B265E]">
            {value}
          </h3>
        </div>

        <div className="p-3 rounded-xl bg-gradient-to-br from-[#7B8CFF] to-[#5B6CFF] shadow-sm text-white">
          {icon}
        </div>
      </div>

      {progressValue !== undefined && (
        <ProgressBar value={progressValue} />
      )}

      <p className="mt-2 text-sm text-[#4F4F74]">{description}</p>

      {extraContent && <div className="mt-2">{extraContent}</div>}

      {/* Subtle glow on hover */}
      <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 blur-md bg-[#A9A6FF]/20 transition-opacity duration-300" />
    </motion.div>
  );
};



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Average Match Score */}
      <MetricCard
        title="Average Match Score"
        value={`${metrics.averageScore}%`}
        description="Based on evaluation scores"
        icon={<Award className="h-5 w-5 text-white" />}
        color="score"
        progressValue={metrics.averageScore}
      />
      
      {/* Top 10% Score */}
      <MetricCard
        title="Top Candidates Ratio"
        value={`${metrics.top10Percent}%`}
        description={`${metrics.top10Count} candidates scored above 90%`}
        icon={<BarChart2 className="h-5 w-5 text-white" />}
        color="top"
        progressValue={metrics.top10Percent}
        progressColor="emerald"
      />
      
      {/* Experience Level */}
      <MetricCard
        title="Experience Level"
        value={`${metrics.averageExperience} yrs`}
        description={`Mostly ${metrics.experienceLevel} level`}
        icon={<Calendar className="h-5 w-5 text-white" />}
        color="experience"
        progressValue={Math.min(100, metrics.averageExperience * 15)}
        progressColor="amber"
        extraContent={
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Junior</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Mid</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Senior</span>
          </div>
        }
      />
      
      {/* Skills Coverage */}
      <MetricCard
        title="Skills Coverage"
        value={`${metrics.skillsCoverage}%`}
        description="Average skills per candidate"
        icon={<Wrench className="h-5 w-5 text-white" />}
        color="skills"
        progressValue={metrics.skillsCoverage}
        progressColor="purple"
      />
    </div>
  );
}