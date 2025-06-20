import { useState } from "react";
import {
  LayoutDashboard,
  BarChartBig,
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  Zap,
  Gem,
} from "lucide-react";
import { useLocation } from "wouter";
import { UserButton } from "@clerk/clerk-react";

const navItems = [
  { title: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/dashboard" },
  { title: "Resumer Analyzer", icon: <BarChartBig className="h-5 w-5" />, path: "/results" },
  { title: "History", icon: <History className="h-5 w-5" />, path: "/history" },
];

export default function Sidebar({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [location, navigate] = useLocation();
  const [credits, setCredits] = useState(15);

  const sidebarWidth = collapsed ? "w-16" : "w-64";

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`h-full ${sidebarWidth} flex flex-col py-6 px-2
          bg-gradient-to-br from-[#5B6CFF] to-[#3F4FCC] backdrop-blur-lg border-r border-[#E1E5F2]/60
          shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 z-40 fixed md:static`}
      >
        <div className={`flex ${collapsed ? "justify-center" : "justify-end"} mb-2`}>
          <button
            className="hidden md:flex items-center justify-center bg-white/30 hover:bg-white/50 text-gray-600 p-1 rounded-md transition"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <div>
          <div className={`flex items-center mb-8 px-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full shadow">
              <span className="font-bold text-lg text-[#5B6CFF]">RA</span>
            </div>
            {!collapsed && (
              <span className="ml-3 text-white font-semibold text-xl tracking-wide">Resumer AI</span>
            )}
          </div>

         

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.title}
                className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200
                  ${location === item.path
                    ? "bg-white/20 text-white font-semibold"
                    : "hover:bg-white/10 text-white"}`}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
              >
                {item.icon}
                {!collapsed && <span className="ml-3 flex-1 text-left">{item.title}</span>}
              </button>
            ))}
          </nav>
        </div>

        {!collapsed ? (
  <div className="mt-6 mx-2 mb-4">
    <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-lg bg-white/5 border border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.015]">
      {/* Animated shimmer glow */}
      <div className="absolute inset-0 z-0 rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent animate-pulse" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white/80 text-sm font-medium tracking-wide">REMAINING CREDITS</h3>
          <Gem className="h-4 w-4 text-yellow-300 animate-ping" />
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center">
            <Zap className="h-6 w-6 text-yellow-400 mr-2" />
            <span className="text-2xl font-bold text-white">{credits}</span>
          </div>
          <button
            className="bg-white/10 hover:bg-white/20 text-xs font-medium px-3 py-1 rounded-full text-white transition-all backdrop-blur-sm"
            onClick={() => setCredits((c) => c + 10)}
          >
            + Get More
          </button>
        </div>

        <div className="mt-3 w-full h-2 rounded-full bg-white/10">
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
      className="relative p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 shadow cursor-pointer group transition-all hover:scale-105"
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


        <div className={`flex items-center px-2 mt-auto ${collapsed ? "justify-center" : ""}`}>
          {!collapsed && <UserButton />}
        </div>
      </aside>

      {/* Main content shifts to the right of sidebar */}
      <main className={`flex-1 ml-0 md:ml-${collapsed ? "16" : "64"} transition-all duration-300 overflow-y-auto`}> 
        {children}
      </main>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
