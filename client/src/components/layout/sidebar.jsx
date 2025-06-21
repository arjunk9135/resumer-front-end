import { useState } from "react";
import {
  LayoutGrid,
  FileBarChart,
  Clock,
  ChevronLeft,
  ChevronRight,
  Zap,
  Gem,
} from "lucide-react";
import { useLocation } from "wouter";
import { UserButton, useUser } from "@clerk/clerk-react"; // Added useUser
import { useMyContext } from "../../hooks/use-context";

const navItems = [
  { title: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { title: "Resumer Analyzer", icon: FileBarChart, path: "/results" },
  { title: "History", icon: Clock, path: "/history" },
];

export default function Sidebar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [location, navigate] = useLocation();
  const [credits, setCredits] = useState(15);
  const { analysisResults, setAnalysisResults, batchDetails, setBatchDetails } = useMyContext();
  const { user } = useUser(); // Get user data from Clerk

  const sidebarWidth = collapsed ? "w-16" : "w-64";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`h-full ${sidebarWidth} flex flex-col py-6 px-3
          bg-white border-r border-[#E4E6F5] transition-all duration-300 z-40 fixed md:static rounded-tr-3xl rounded-br-3xl shadow-lg`}
      >
        {/* Collapse Button */}
        <div className={`flex ${collapsed ? "justify-center" : "justify-end"} mb-4`}>
          <button
            className="hidden md:flex items-center justify-center bg-[#F1F3FF] hover:bg-[#e2e7ff] text-[#4B5FFF] p-1 rounded-md transition"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Logo */}
        <div className={`flex items-center mb-8 px-2 ${collapsed ? "justify-center" : ""}`}>
  {/* Add aspect-square to force perfect circle */}
  <div className="w-9 h-9 aspect-square bg-[#4B5FFF] text-white flex items-center justify-center rounded-full shadow">
    <span className="font-bold text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-icon lucide-brain">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>
    </span>
  </div>
  {!collapsed && (
    <span className="ml-3 text-[#1E255E] font-bold text-xl tracking-wide">Resumer AI</span>
  )}
</div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 text-[#6B6F94] text-sm font-medium">
          {navItems.map(({ title, icon: Icon, path }) => {
            const active = location === path;
            return (
              <button
                key={title}
                className={`flex items-center w-full px-3 py-2 rounded-xl transition-all duration-200
                  ${active
                    ? "bg-[#EDF0FF] text-[#1E255E] font-semibold shadow-sm"
                    : "hover:bg-[#F4F6FD] text-[#6B6F94]"}`}
                onClick={() => {
                  navigate(path);
                  setBatchDetails(null);
                  setMobileOpen(false);
                }}
              >
                <Icon className={`h-5 w-5 ${active ? "text-[#4B5FFF]" : ""}`} />
                {!collapsed && <span className="ml-3">{title}</span>}
              </button>
            );
          })}
        </nav>

        {/* Credits Box */}
        {!collapsed ? (
          <div className="mt-6 mx-2 mb-4">
            <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-[#DDE2FF] to-[#BEC9FF] shadow-md">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#1E255E] text-xs font-semibold">REMAINING CREDITS</h3>
                  <Gem className="h-4 w-4 text-yellow-400" />
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-lg font-bold text-[#1E255E]">{credits}</span>
                  </div>
                  <button
                    className="bg-white/30 hover:bg-white/50 text-[11px] font-medium px-3 py-1 rounded-full text-[#1E255E] transition"
                    onClick={() => setCredits((c) => c + 10)}
                  >
                    + Get More
                  </button>
                </div>
                <div className="mt-3 w-full h-2 rounded-full bg-white/30">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (credits / 20) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-auto mb-4 flex justify-center">
            <div
              className="relative p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/10 shadow cursor-pointer group transition-all hover:scale-105"
              onClick={() => setCollapsed(false)}
              title="Remaining Credits"
            >
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform group-hover:scale-110 transition-all">
                {credits}
              </span>
            </div>
          </div>
        )}

        {/* Enhanced User Section */}
        <div className={`mt-auto px-2 ${collapsed ? "flex justify-center" : ""}`}>
          {collapsed ? (
            <div className="flex justify-center">
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F4F6FD] transition-colors">
              <div className="relative">
                <UserButton />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-[#1E255E] truncate">
                  {user?.fullName || "User"}
                </span>
                <span className="text-xs text-[#6B6F94] truncate">
                  {user?.primaryEmailAddress?.emailAddress || "user@example.com"}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ml-0 md:ml-${collapsed ? "16" : "64"} transition-all duration-300 overflow-y-auto bg-[#F4F6FF]`}
      >
        {children}
      </main>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}