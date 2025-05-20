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
    staleTime: 60000
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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 to-gray-800 text-white shadow-lg border-b border-gray-700 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="text-xl font-bold tracking-tight text-white select-none">
          {/* Resume Analyzer */}
        </div>

        <div className="flex items-center space-x-4">
          {/* Remaining Credits */}
          <div className="flex items-center px-3 py-1.5 bg-green-500/10 text-green-400 text-sm font-medium rounded-full shadow-inner backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>Credits: <span className="font-bold text-white">35</span></span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:text-green-400 transition-colors duration-150"
              onClick={handleNotificationClick}
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-xs text-white font-bold rounded-full flex items-center justify-center shadow-md">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-md shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-100">
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
                      <NotificationItem key={notification.id} notification={notification} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full h-9 w-9 p-0 ring-2 ring-white/20 hover:ring-green-400 transition">
                <Avatar>
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80"
                    alt="User"
                  />
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
