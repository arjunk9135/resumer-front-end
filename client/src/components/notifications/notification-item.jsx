import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationItem({ notification }) {
  // Helper functions to determine notification styles based on type
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return { bgColor: 'bg-green-100', textColor: 'text-green-600' };
      case 'warning':
        return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' };
      case 'error':
        return { bgColor: 'bg-red-100', textColor: 'text-red-600' };
      case 'info':
      default:
        return { bgColor: 'bg-blue-100', textColor: 'text-blue-600' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✖';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const styles = getTypeStyles(notification.type);
  
  return (
    <div className={`p-4 hover:bg-gray-50 ${notification.isRead ? 'opacity-75' : ''}`}>
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${styles.bgColor}`}>
            <span className={`text-sm ${styles.textColor}`}>
              {getTypeIcon(notification.type)}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text">{notification.title}</p>
          <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
          
          {notification.relatedId && notification.relatedType === 'analysis' && (
            <div className="mt-1">
              <Link href={`/results/${notification.relatedId}`}>
                <Button variant="link" className="text-xs text-primary p-0 h-auto">
                  View Results
                </Button>
              </Link>
            </div>
          )}
          
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
