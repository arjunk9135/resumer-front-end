import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';

export default function InProgressCard({ analysis }) {
  // Determine progress percentage based on status
  const getProgressPercentage = () => {
    if (analysis.status === 'queued') return 0;
    if (analysis.status === 'completed') return 100;
    
    // For processing status, generate a random percentage between 15-90%
    // In a real app, this would come from the backend
    return Math.floor(Math.random() * 75) + 15;
  };
  
  const progressPercentage = getProgressPercentage();
  
  // Calculate remaining time estimate (mock values)
  const getRemainingTime = () => {
    if (analysis.status === 'queued') return 'Starting soon';
    if (analysis.status === 'completed') return 'Completed';
    
    const remainingMinutes = Math.floor((100 - progressPercentage) / 100 * 60);
    return `~${remainingMinutes} min remaining`;
  };
  
  // Format time since creation
  const getStartTime = () => {
    if (!analysis.createdAt) return 'Recently';
    
    return formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: false }) + ' ago';
  };
  
  return (
    <div className="border border-gray-200 rounded-md p-4">
      <div className="flex justify-between">
        <Link href={`/results/${analysis.id}`}>
          <h3 className="font-medium text-text hover:text-primary cursor-pointer">
            {analysis.jobTitle}
          </h3>
        </Link>
        <Badge variant={analysis.status === 'queued' ? 'secondary' : 'default'}>
          {analysis.status === 'queued' ? 'Queued' : 'Processing'}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-500 mt-1">
        {analysis.candidateCount} candidate{analysis.candidateCount !== 1 ? 's' : ''}
      </p>
      
      <div className="mt-3 w-full">
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>
          {analysis.status === 'queued' ? 'Queued: ' : 'Started: '}
          {getStartTime()}
        </span>
        <span>{getRemainingTime()}</span>
      </div>
    </div>
  );
}
