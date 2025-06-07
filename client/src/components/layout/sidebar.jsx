import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

import {
  LayoutDashboard,
  FileSearch,
  Clock,
  BarChartBig,
  History,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const navItems = [
    { title: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/' },
    { title: 'Resume Analyzer', icon: <FileSearch className="h-5 w-5" />, path: '/resume-analyzer' },
    { title: 'Analysis Queue', icon: <Clock className="h-5 w-5" />, path: '/analysis-queue' },
    { title: 'Results', icon: <BarChartBig className="h-5 w-5" />, path: '/results' },
    { title: 'History', icon: <History className="h-5 w-5" />, path: '/history' },
    { title: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ];
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const isActive = (path) => {
    if (path === '/') return location === path;
    return location.startsWith(path);
  };
  
  const renderNavItems = () =>
  navItems.map(item => {
    const active = isActive(item.path);
    return (
      <Link 
        key={item.path} 
        href={item.path}
        onClick={closeMobileMenu}
        className={cn(
          "flex items-center py-3 px-4 rounded-md transition-colors",
          active
            ? "bg-primary text-white"
            : "text-black hover:bg-primary hover:text-white"
        )}
      >
        {item.icon}
        <span className="ml-3">{item.title}</span>
      </Link>
    );
  });

  
  // Mobile menu button
  const mobileMenuButton = (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden ml-2" 
      onClick={toggleMobileMenu}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Open menu</span>
    </Button>
  );
  
  // Mobile sidebar
  const mobileSidebar = (
    <div className={`fixed inset-0 z-40 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={closeMobileMenu}></div>
      <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-card">
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-display font-bold text-primary">TalentInsight</h1>
          <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 h-[calc(100vh-136px)]">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {renderNavItems()}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:bg-gray-100" 
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {mobileMenuButton}
      {mobileSidebar}
      
      <div className="hidden md:flex flex-col w-64 bg-white shadow-card">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-display font-bold text-primary">TalentInsight</h1>
        </div>
        <ScrollArea className="flex-1 h-[calc(100vh-136px)]">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {renderNavItems()}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:bg-gray-100" 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
          </Button>
        </div>
      </div>
    </>
  );
}
