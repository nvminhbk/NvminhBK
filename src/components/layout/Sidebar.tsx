import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  School,
  Users,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Atom,
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { activeTab, setActiveTab, stats } = useApp();

  const menuItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
    },
    {
      id: 'classes',
      label: 'Quản lý lớp học',
      icon: <School className="w-5 h-5 shrink-0" />,
      badge: stats.totalClasses
    },
    {
      id: 'students',
      label: 'Quản lý học sinh',
      icon: <Users className="w-5 h-5 shrink-0" />,
      badge: stats.totalStudents
    },
    {
      id: 'assignments',
      label: 'Quản lý bài tập',
      icon: <FileText className="w-5 h-5 shrink-0" />,
      badge: stats.totalAssignments
    },
    {
      id: 'exams',
      label: 'Quản lý đề kiểm tra',
      icon: <FileSpreadsheet className="w-5 h-5 shrink-0" />,
      badge: stats.totalExams
    },
    {
      id: 'results',
      label: 'Kết quả học tập',
      icon: <TrendingUp className="w-5 h-5 shrink-0" />
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: <Settings className="w-5 h-5 shrink-0" />
    }
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 shadow-md text-white shrink-0 ring-2 ring-indigo-500/20">
            <Atom className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5 whitespace-nowrap">
                PHYSICS TEACHER
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  THPT
                </span>
              </span>
              <span className="text-xs text-slate-400 font-medium truncate">
                Quản lý học sinh & Điểm số
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed && !isMobileOpen ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
            >
              <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`}>
                {item.icon}
              </div>

              {(!isCollapsed || isMobileOpen) && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {(!isCollapsed || isMobileOpen) && item.badge !== undefined && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active Indicator bar */}
              {isActive && isCollapsed && !isMobileOpen && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r-md" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Grades Pill overview */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Phân hệ theo khối</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-blue-950/50 border border-blue-800/40 text-blue-300">
              <div className="font-bold">K10</div>
              <div className="text-[10px] text-blue-400/80">{stats.grade10.classCount} lớp</div>
            </div>
            <div className="p-1.5 rounded-lg bg-indigo-950/50 border border-indigo-800/40 text-indigo-300">
              <div className="font-bold">K11</div>
              <div className="text-[10px] text-indigo-400/80">{stats.grade11.classCount} lớp</div>
            </div>
            <div className="p-1.5 rounded-lg bg-purple-950/50 border border-purple-800/40 text-purple-300">
              <div className="font-bold">K12</div>
              <div className="text-[10px] text-purple-400/80">{stats.grade12.classCount} lớp</div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Collapse Toggle */}
      <div className="hidden md:flex items-center justify-between p-3 border-t border-slate-800/80">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Thu gọn thanh bên</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:block shrink-0 h-screen sticky top-0 transition-all duration-300 z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
