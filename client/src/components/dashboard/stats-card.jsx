import { FileText, UserSearch, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorMap = {
  primary: {
    bg: 'bg-indigo-100',
    icon: 'text-indigo-600',
    changeUp: 'text-green-600',
    changeDown: 'text-red-600',
  },
  secondary: {
    bg: 'bg-pink-100',
    icon: 'text-pink-600',
    changeUp: 'text-green-600',
    changeDown: 'text-red-600',
  },
  accent: {
    bg: 'bg-yellow-100',
    icon: 'text-yellow-600',
    changeUp: 'text-green-600',
    changeDown: 'text-red-600',
  },
};

export default function StatsCard({ title, value, change, icon, color = 'primary' }) {
  const icons = {
    'file-list': <FileText className="w-6 h-6" />,
    'user-search': <UserSearch className="w-6 h-6" />,
    'time': <Clock className="w-6 h-6" />,
    'award': <Award className="w-6 h-6" />,
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <div className={`${colors.icon}`}>
            {icons[icon]}
          </div>
        </div>
        <div>
          <h3 className="text-gray-500 font-semibold text-sm tracking-wide uppercase">{title}</h3>
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center space-x-2 text-sm font-medium">
          {change.direction ? (
            <>
              <span className={change.direction === 'up' ? colors.changeUp : colors.changeDown}>
                {change.direction === 'up' ? (
                  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7"></path></svg>
                ) : (
                  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                )}
                {change.value}
              </span>
              <span className="text-gray-400">{change.text}</span>
            </>
          ) : (
            <span className="text-gray-400">{change.value} {change.text}</span>
          )}
        </div>
      )}
    </div>
  );
}
