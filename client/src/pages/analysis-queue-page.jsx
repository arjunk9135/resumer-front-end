import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { RefreshCw } from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function AnalysisQueuePage() {
  const { toast } = useToast();
  
  // Mock fetch analyses from sessionStorage
  const { data: analyses = [], refetch } = useQuery({
    queryKey: ['/api/analyses'],
    queryFn: () => {
      // Get analyses from sessionStorage
      const storedAnalyses = JSON.parse(sessionStorage.getItem('analyses') || '[]');
      return storedAnalyses;
    }
  });
  
  // Mock fetch notifications from sessionStorage
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: () => {
      // Get notifications from sessionStorage
      const storedNotifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
      return storedNotifications;
    }
  });
  
  // Filter analyses that are in progress
  const queuedAnalyses = analyses.filter(a => 
    a.status === 'queued' || a.status === 'processing'
  );
  
  // Handle refresh click
  const handleRefresh = () => {
    refetch();
    toast({
      title: 'Refreshed',
      description: 'The queue has been refreshed',
    });
  };
  
  // Handle cancel analysis - updated to work with sessionStorage
  const handleCancel = async (analysisId) => {
    try {
      // Get analyses from sessionStorage
      const analyses = JSON.parse(sessionStorage.getItem('analyses') || '[]');
      
      // Update the status of the specified analysis
      const updatedAnalyses = analyses.map(analysis => {
        if (analysis.id === analysisId) {
          return { ...analysis, status: 'failed' };
        }
        return analysis;
      });
      
      // Save the updated analyses back to sessionStorage
      sessionStorage.setItem('analyses', JSON.stringify(updatedAnalyses));
      
      // Create a notification for the cancelled analysis
      const notifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
      const cancelNotification = {
        id: Math.floor(Math.random() * 10000) + 200,
        userId: 1,
        title: 'Analysis Cancelled',
        message: 'Your analysis has been cancelled.',
        type: 'error',
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: analysisId,
        relatedType: 'analysis'
      };
      notifications.push(cancelNotification);
      sessionStorage.setItem('notifications', JSON.stringify(notifications));
      
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries();
      
      toast({
        title: 'Analysis cancelled',
        description: 'The analysis has been cancelled',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to cancel analysis',
        variant: 'destructive',
      });
    }
  };
  
  // Helper to get progress percentage
  const getProgressPercentage = (analysis) => {
    if (analysis.status === 'queued') return 0;
    if (analysis.status === 'completed') return 100;
    
    // For processing status, generate a random percentage between 15-90%
    return Math.floor(Math.random() * 75) + 15;
  };
  
  // Get estimated time
  const getEstimatedTime = (analysis) => {
    if (analysis.status === 'queued') return 'Waiting in queue';
    
    const progress = getProgressPercentage(analysis);
    const remainingMinutes = Math.floor((100 - progress) / 100 * 60);
    return `Estimated: ${remainingMinutes}min`;
  };
  
  return (
    <PageContainer title="Analysis Queue">
      <div className="space-y-6">
        {/* Current Queue */}
        <Card>
          <CardHeader className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <CardTitle className="font-display font-semibold text-lg text-text">Current Queue</CardTitle>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {queuedAnalyses.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">No analyses in the queue</p>
                <Link href="/resume-analyzer">
                  <Button>Start New Analysis</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analysis Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidates</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {queuedAnalyses.map(analysis => {
                      const progress = getProgressPercentage(analysis);
                      
                      return (
                        <tr key={analysis.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-text">{analysis.jobTitle}</div>
                            <div className="text-xs text-gray-500">{analysis.department || analysis.name}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{analysis.candidateCount}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {analysis.createdAt 
                                ? formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })
                                : 'Recently'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge variant={analysis.status === 'queued' ? 'secondary' : 'default'}>
                              {analysis.status === 'queued' ? 'Queued' : 'Processing'}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap w-48">
                            <div className="w-full">
                              <Progress value={progress} className="h-2" />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {progress}% - {getEstimatedTime(analysis)}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/results/${analysis.id}`}>
                              <Button variant="link" className="text-primary">Details</Button>
                            </Link>
                            <Button 
                              variant="link" 
                              className="text-red-500"
                              onClick={() => handleCancel(analysis.id)}
                            >
                              Cancel
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
                onClick={() => {
                  // Get notifications from sessionStorage
                  const notifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
                  
                  // Mark all as read
                  const updatedNotifications = notifications.map(notification => ({
                    ...notification,
                    isRead: true
                  }));
                  
                  // Save back to sessionStorage
                  sessionStorage.setItem('notifications', JSON.stringify(updatedNotifications));
                  
                  // Refresh UI
                  queryClient.invalidateQueries();
                  
                  toast({
                    title: 'Notifications updated',
                    description: 'All notifications marked as read'
                  });
                }}
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

// Helper functions for notification styling
function getNotificationTypeStyles(type) {
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
}

function getNotificationTypeIcon(type) {
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
}
