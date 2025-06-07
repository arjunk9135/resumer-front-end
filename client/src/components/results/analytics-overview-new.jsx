import { Award, BarChart2, Calendar, Wrench, ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AnalyticsOverview({ candidates, loading }) {
  // Color scheme configuration
  const colorMap = {
    score: {
      bg: 'bg-indigo-500/10',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      text: 'text-indigo-700 dark:text-indigo-300',
      value: 'text-indigo-900 dark:text-white',
      border: 'border-indigo-200 dark:border-indigo-900/50',
    },
    top: {
      bg: 'bg-emerald-500/10',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      text: 'text-emerald-700 dark:text-emerald-300',
      value: 'text-emerald-900 dark:text-white',
      border: 'border-emerald-200 dark:border-emerald-900/50',
    },
    experience: {
      bg: 'bg-amber-500/10',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      text: 'text-amber-700 dark:text-amber-300',
      value: 'text-amber-900 dark:text-white',
      border: 'border-amber-200 dark:border-amber-900/50',
    },
    skills: {
      bg: 'bg-purple-500/10',
      iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
      text: 'text-purple-700 dark:text-purple-300',
      value: 'text-purple-900 dark:text-white',
      border: 'border-purple-200 dark:border-purple-900/50',
    }
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
  const ProgressBar = ({ value, color = 'indigo' }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, type: 'spring' }}
        className={cn(
          'h-2 rounded-full',
          color === 'indigo' && 'bg-indigo-600',
          color === 'emerald' && 'bg-emerald-600',
          color === 'amber' && 'bg-amber-600',
          color === 'purple' && 'bg-purple-600'
        )}
      />
    </div>
  );

  // Metric Card component
  const MetricCard = ({ 
    title, 
    value, 
    description, 
    icon, 
    color = 'score',
    progressValue,
    progressColor,
    extraContent
  }) => {
    const colors = colorMap[color] || colorMap.score;
    
    return (
      <motion.div
        whileHover={{ y: -5 }}
        className={cn(
          "relative rounded-xl p-6 border backdrop-blur-sm",
          colors.bg,
          colors.border,
          "transition-all duration-300 hover:shadow-lg"
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className={cn("text-sm font-medium mb-1", colors.text)}>
              {title}
            </p>
            <h3 className={cn("text-3xl font-bold", colors.value)}>
              {loading ? '...' : value}
            </h3>
          </div>
          
          <div className={cn(
            "p-3 rounded-xl shadow-sm",
            colors.iconBg
          )}>
            {icon}
          </div>
        </div>

        {progressValue !== undefined && (
          <ProgressBar 
            value={progressValue} 
            color={progressColor || color} 
          />
        )}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {loading ? '...' : description}
        </p>

        {extraContent && (
          <div className="mt-2">
            {extraContent}
          </div>
        )}

        {/* Glow effect */}
        <div className={cn(
          "absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 blur-md",
          color === 'score' && 'bg-indigo-400/20',
          color === 'top' && 'bg-emerald-400/20',
          color === 'experience' && 'bg-amber-400/20',
          color === 'skills' && 'bg-purple-400/20',
          "transition-opacity duration-300"
        )} />
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