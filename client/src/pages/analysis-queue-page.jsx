import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { RefreshCw } from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import Table from '../components/results/analytics-queue-table';

export default function AnalysisQueuePage() {
  const { toast } = useToast();

  const [analyses, setAnalyses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch analyses from your API
  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const url = 'http://127.0.0.1:8000/api/all-evaluations/'; // trailing slash if needed
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // Add more headers if your backend expects them
        },
        mode: 'cors', // allows cross-origin requests
        credentials: 'omit', // or 'include' if cookies needed
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);  // Check what you get here

      setAnalyses(data); // update your React state

    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Could not load analyses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };



  // Fetch notifications from your API
  const fetchNotifications = async () => {
    try {
      // Replace with your actual API endpoint
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Could not load notifications',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAnalyses();
    // fetchNotifications();
  }, []);


  const handleRefresh = () => {
    fetchAnalyses();
    fetchNotifications();
    toast({
      title: 'Refreshed',
      description: 'The queue has been refreshed',
    });
  };

  const handleCancel = async (analysisId) => {
    try {
      // Call your cancel API endpoint - update as per your backend
      const res = await fetch(`/api/analyses/${analysisId}/cancel`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to cancel analysis');

      toast({
        title: 'Analysis cancelled',
        description: 'The analysis has been cancelled',
      });

      // Refresh list after cancelling
      fetchAnalyses();
      fetchNotifications();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel analysis',
        variant: 'destructive',
      });
    }
  };

  const getProgressPercentage = (analysis) => {
    if (analysis.status === 'queued') return 0;
    if (analysis.status === 'completed') return 100;
    return Math.floor(Math.random() * 75) + 15;
  };

  const getEstimatedTime = (analysis) => {
    if (analysis.status === 'queued') return 'Waiting in queue';
    const progress = getProgressPercentage(analysis);
    const remainingMinutes = Math.floor((100 - progress) / 100 * 60);
    return `Estimated: ${remainingMinutes}min`;
  };

  const markAllNotificationsRead = () => {
    // Ideally, send a request to mark notifications read in backend, here just optimistic UI update:
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);

    toast({
      title: 'Notifications updated',
      description: 'All notifications marked as read',
    });
  };

  return (
    <PageContainer title="Analysis Queue">
      <div className="space-y-6">
        {/* Current Queue */}

        <Card>
          <CardHeader className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            {/* <CardTitle className="font-display font-semibold text-lg text-text">
            
            </CardTitle> */}
          </CardHeader>
          <CardContent className="p-0">
            <Table
              data={analyses}
              loading={loading}
              onRefresh={handleRefresh}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
        {/* Notifications Card */}
        <Card>
          <CardHeader className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <CardTitle className="font-display font-semibold text-lg text-text">Notifications</CardTitle>
              <Button
                variant="link"
                className="text-primary text-sm p-0 h-auto"
                onClick={markAllNotificationsRead}
              >
                Mark all as read
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div key={notification.id} className="p-6 hover:bg-gray-50">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getNotificationTypeStyles(notification.type).bgColor}`}>
                          <span className={`text-lg ${getNotificationTypeStyles(notification.type).textColor}`}>
                            {getNotificationTypeIcon(notification.type)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{notification.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        {notification.relatedId && notification.relatedType === 'analysis' && (
                          <div className="mt-2">
                            <Link href={`/results/${notification.relatedId}`}>
                              <Button variant="link" className="text-sm text-primary p-0 h-auto">View Results</Button>
                            </Link>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function getNotificationTypeStyles(type) {
  switch (type) {
    case 'success':
      return { bgColor: 'bg-green-100', textColor: 'text-green-600' };
    case 'error':
      return { bgColor: 'bg-red-100', textColor: 'text-red-600' };
    case 'warning':
      return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' };
    default:
      return { bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
  }
}

function getNotificationTypeIcon(type) {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '⚠';
    case 'warning':
      return '!';
    default:
      return 'ℹ';
  }
}
