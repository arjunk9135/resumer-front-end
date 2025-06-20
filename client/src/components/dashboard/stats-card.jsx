import { FileText, Users, Clock, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const colorMap = {
  primary: {
    bg: 'bg-[#5B6CFF]/10',
    iconBg: 'bg-gradient-to-br from-[#5B6CFF] to-[#3F4FCC]',
    icon: 'text-white',
    text: 'text-[#3F4FCC] dark:text-[#7B8CFF]',
    value: 'text-[#2F49D1] dark:text-white',
    changeUp: 'text-[#44C97F] dark:text-[#44C97F]',
    changeDown: 'text-[#F95E5E] dark:text-[#F95E5E]',
    border: 'border-[#E1E5F2] dark:border-[#3F4FCC]/50',
  },
  secondary: {
    bg: 'bg-[#44C97F]/10',
    iconBg: 'bg-gradient-to-br from-[#44C97F] to-[#2F855A]',
    icon: 'text-white',
    text: 'text-[#2F855A] dark:text-[#44C97F]',
    value: 'text-[#22543D] dark:text-white',
    changeUp: 'text-[#44C97F] dark:text-[#44C97F]',
    changeDown: 'text-[#F95E5E] dark:text-[#F95E5E]',
    border: 'border-[#C6F6D5] dark:border-[#2F855A]/50',
  },
  accent: {
    bg: 'bg-[#7B8CFF]/10',
    iconBg: 'bg-gradient-to-br from-[#7B8CFF] to-[#5B6CFF]',
    icon: 'text-white',
    text: 'text-[#5B6CFF] dark:text-[#7B8CFF]',
    value: 'text-[#3F4FCC] dark:text-white',
    changeUp: 'text-[#44C97F] dark:text-[#44C97F]',
    changeDown: 'text-[#F95E5E] dark:text-[#F95E5E]',
    border: 'border-[#D6DFFF] dark:border-[#5B6CFF]/50',
  },
};


export default function StatsCard({ title, value, change, icon, color = 'primary' }) {
  const icons = {
    'file-list': <FileText className="w-5 h-5" />,
    'user-search': <Users className="w-5 h-5" />,
    'time': <Clock className="w-5 h-5" />,
    'award': <Award className="w-5 h-5" />,
  };

  const colors = colorMap[color] || colorMap.primary;

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
            {value}
          </h3>
        </div>
        
        <div className={cn(
          "p-3 rounded-xl shadow-sm",
          colors.iconBg
        )}>
          <span className={colors.icon}>
            {icons[icon]}
          </span>
        </div>
      </div>

      {change && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex items-center gap-2 text-sm"
        >
          {change.direction ? (
            <>
              <span className={cn(
                "inline-flex items-center font-medium",
                change.direction === 'up' ? colors.changeUp : colors.changeDown
              )}>
                {change.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {change.value}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {change.text}
              </span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              {change.value} {change.text}
            </span>
          )}
        </motion.div>
      )}
      
      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 blur-md",
        color === 'primary' && 'bg-indigo-400/20',
        color === 'secondary' && 'bg-emerald-400/20',
        color === 'accent' && 'bg-purple-400/20',
        "transition-opacity duration-300"
      )} />
    </motion.div>
  );
}