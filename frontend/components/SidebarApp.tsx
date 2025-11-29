'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  FileText,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';

interface SidebarAppProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarApp: React.FC<SidebarAppProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { href: '/predictions', label: 'Predictions', icon: TrendingUp },
    { href: '/anomalies', label: 'Anomalies', icon: Activity },
    { href: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside className={`
      ${sidebarOpen ? 'w-72' : 'w-16 lg:w-20'} 
      bg-gradient-to-b from-gray-900/80 to-black/95 backdrop-blur-xl border-r border-white/5 
      flex flex-col relative transition-all duration-300 ease-in-out
      fixed lg:relative inset-y-0 left-0 z-[46] lg:z-auto
      translate-x-0
    `}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-3 lg:p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
              {sidebarOpen ? (
                <>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/10 flex items-center justify-center border border-green-500/20 flex-shrink-0">
                    <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                  </div>
                  <div className="overflow-hidden">
                    <h1 className="text-base lg:text-lg font-bold text-white tracking-tight">Surveillance AI</h1>
                    <p className="text-[9px] lg:text-[10px] text-gray-500 uppercase tracking-wider">Dashboard</p>
                  </div>
                </>
              ) : (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/10 flex items-center justify-center border border-green-500/20 mx-auto">
                  <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
            >
              {sidebarOpen ? <ChevronLeft size={14} className="text-gray-400 lg:w-4 lg:h-4" /> : <ChevronRight size={14} className="text-gray-400 lg:w-4 lg:h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 lg:p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`group flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 shadow-lg shadow-green-500/10'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <div className={`p-1.5 lg:p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                  isActive 
                    ? 'bg-green-500/20' 
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon size={16} strokeWidth={2.5} className="lg:w-[18px] lg:h-[18px]" />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="font-medium text-xs lg:text-sm flex-1">{item.label}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Status */}
        {sidebarOpen && (
          <div className="p-2 lg:p-3 border-t border-white/5">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-lg lg:rounded-xl p-2 lg:p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-wider">System Status</p>
                  <p className="text-[10px] lg:text-xs text-white font-medium">Operational</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarApp;
