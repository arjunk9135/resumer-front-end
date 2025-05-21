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
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleCollapse = () => setCollapsed(!collapsed);
  
  const navItems = [
    { title: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
    { title: 'Resume Analyzer', icon: <FileSearch className="h-5 w-5" />, path: '/resume-analyzer' },
    { title: 'Analysis Queue', icon: <Clock className="h-5 w-5" />, path: '/analysis-queue' },
    { title: 'Results', icon: <BarChartBig className="h-5 w-5" />, path: '/results' },
    { title: 'History', icon: <History className="h-5 w-5" />, path: '/history' },
    { title: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ];
  
  const handleLogout = () => logoutMutation.mutate();
  
  const isActive = (path) => {
    if (path === '/') return location === path;
    return location.startsWith(path);
  };
  
const renderNavItems = () =>
  navItems.map(item => {
    const active = isActive(item.path);
    return (
      <div key={item.path} className="relative group">
        {/* Always render the link, but control visibility differently */}
        <Link 
          href={item.path}
          onClick={closeMobileMenu}
          className={cn(
            "flex items-center py-3 rounded-xl",
            active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
            collapsed ? "justify-center px-3 mx-2" : "px-4 justify-start"
          )}
        >
          <div className={active ? "text-white" : "text-gray-400 group-hover:text-white"}>
            {item.icon}
          </div>
          {/* Text label - visibility controlled by parent group */}
          <span className={cn(
            "ml-3 whitespace-nowrap",
            collapsed ? "hidden" : "inline",
            active ? "text-white" : "text-gray-400 group-hover:text-white"
          )}>
            {item.title}
          </span>
        </Link>
        
        {/* Tooltip only shown when collapsed */}
        {collapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
            <div className="bg-gray-900 border border-gray-800 text-white px-3 py-2 shadow-lg rounded-lg whitespace-nowrap">
              {item.title}
            </div>
          </div>
        )}
      </div>
    );
  });

  // Mobile menu button
  const mobileMenuButton = (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden ml-2 text-gray-400 hover:bg-gray-800 hover:text-white" 
      onClick={toggleMobileMenu}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Open menu</span>
    </Button>
  );
  
  // Mobile sidebar
  const mobileSidebar = (
    <div className={`fixed inset-0 z-40 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeMobileMenu}></div>
      <div className="absolute inset-y-0 left-0 w-72 bg-gray-950 shadow-2xl rounded-r-3xl overflow-hidden border-r border-gray-800">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">TalentInsight</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:bg-gray-800 hover:text-white" 
            onClick={closeMobileMenu}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 h-[calc(100vh-136px)]">
          <nav className="flex-1 px-3 py-5 space-y-2">
            {renderNavItems()}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-gray-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-400 hover:bg-gray-800 hover:text-white" 
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
      
      <div className={cn(
        "hidden md:flex flex-col bg-gray-950 border-r border-gray-800 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}>
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          {!collapsed && (
            <h1 className="text-2xl font-bold text-white">TalentInsight</h1>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-white" 
            onClick={toggleCollapse}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <ScrollArea className="flex-1 h-[calc(100vh-136px)]">
          <nav className="flex-1 px-3 py-5 space-y-2">
            {renderNavItems()}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-gray-800">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-gray-400 hover:bg-gray-800 hover:text-white",
              collapsed ? "justify-center" : "justify-start"
            )} 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && (
              <span>{logoutMutation.isPending ? "Signing out..." : "Sign Out"}</span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}