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
import { UserButton } from "@clerk/clerk-react";

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
          <div className="w-9 h-9 bg-[#4B5FFF] text-white flex items-center justify-center rounded-full shadow">
            <span className="font-bold text-lg">RA</span>
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

        {/* User Section */}
        <div className={`flex items-center px-2 mt-auto ${collapsed ? "justify-center" : ""}`}>
          {!collapsed && <UserButton />}
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
