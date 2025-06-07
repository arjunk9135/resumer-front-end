import { FileText, Users, Clock, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const colorMap = {
  primary: {
    bg: 'bg-indigo-500/10',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    icon: 'text-white',
    text: 'text-indigo-700 dark:text-indigo-300',
    value: 'text-indigo-900 dark:text-white',
    changeUp: 'text-emerald-600 dark:text-emerald-400',
    changeDown: 'text-rose-600 dark:text-rose-400',
    border: 'border-indigo-200 dark:border-indigo-900/50',
  },
  secondary: {
    bg: 'bg-emerald-500/10',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    icon: 'text-white',
    text: 'text-emerald-700 dark:text-emerald-300',
    value: 'text-emerald-900 dark:text-white',
    changeUp: 'text-emerald-600 dark:text-emerald-400',
    changeDown: 'text-rose-600 dark:text-rose-400',
    border: 'border-emerald-200 dark:border-emerald-900/50',
  },
  accent: {
    bg: 'bg-purple-500/10',
    iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
    icon: 'text-white',
    text: 'text-purple-700 dark:text-purple-300',
    value: 'text-purple-900 dark:text-white',
    changeUp: 'text-emerald-600 dark:text-emerald-400',
    changeDown: 'text-rose-600 dark:text-rose-400',
    border: 'border-purple-200 dark:border-purple-900/50',
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