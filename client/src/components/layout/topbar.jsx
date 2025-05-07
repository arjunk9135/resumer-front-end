import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import NotificationItem from '@/components/notifications/notification-item';

export default function Topbar() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ['/api/notifications'],
    staleTime: 60000 // 1 minute
  });
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    
    if (unreadCount > 0) {
      try {
        await apiRequest('POST', '/api/notifications/read-all');
        refetchNotifications();
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    }
  };
  
  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <header className="bg-white shadow-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          {/* Empty div to maintain spacing */}
        </div>
        
        <div className="flex items-center">
          {/* Notifications */}
          <div className="relative mr-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-accent rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-primary h-auto py-1"
                    onClick={() => apiRequest('POST', '/api/notifications/read-all').then(() => refetchNotifications())}
                  >
                    Mark all as read
                  </Button>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-6 px-4 text-center text-gray-500">
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification} 
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" alt="User" />
                  <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.role || 'HR Manager'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
