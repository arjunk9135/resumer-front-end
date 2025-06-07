import { FileText, UserSearch, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatsCard({ title, value, change, icon, color = 'primary' }) {
  // Icon map
  const icons = {
    'file-list': <FileText className={`text-xl text-${color}`} />,
    'user-search': <UserSearch className={`text-xl text-${color}`} />,
    'time': <Clock className={`text-xl text-${color}`} />,
    'award': <Award className={`text-xl text-${color}`} />
  };
  
  // Color classes for the change text
  const changeColorClasses = {
    'up': 'text-secondary',
    'down': 'text-accent',
    undefined: 'text-accent'
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-card">
      <div className="flex items-center">
        <div className={cn(`p-3 rounded-md bg-opacity-10`, `bg-${color}`)}>
          {icons[icon]}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-text">{value}</p>
        </div>
      </div>
      
      {change && (
        <div className="mt-4">
          {change.direction && (
            <span className={cn("text-sm font-medium", changeColorClasses[change.direction])}>
              {change.direction === 'up' ? '↑' : '↓'} {change.value}
            </span>
          )}
          {!change.direction && (
            <span className="text-accent text-sm font-medium">
              {change.value}
            </span>
          )}
          {change.text && (
            <span className="text-sm text-gray-500"> {change.text}</span>
          )}
        </div>
      )}
    </div>
  );
}
