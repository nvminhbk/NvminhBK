import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Check,
  ExternalLink,
  Plus,
  User,
  GraduationCap
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onToggleCollapse: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  onToggleCollapse
}) => {
  const {
    activeTab,
    setActiveTab,
    teacherProfile,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsGlobalSearchOpen
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Tổng quan hệ thống',
          subtitle: 'Khối 10 • Khối 11 • Khối 12'
        };
      case 'classes':
        return {
          title: 'Quản lý lớp học',
          subtitle: 'Danh sách các lớp giảng dạy và thông tin chi tiết'
        };
      case 'students':
        return {
          title: 'Quản lý học sinh',
          subtitle: 'Hồ sơ học sinh, thông tin liên lạc và lịch sử điểm'
        };
      case 'assignments':
        return {
          title: 'Quản lý bài tập Vật lý',
          subtitle: 'Giao bài tập, theo dõi nộp bài và chấm điểm theo chủ đề'
        };
      case 'exams':
        return {
          title: 'Quản lý đề kiểm tra & đề thi',
          subtitle: 'Soạn đề kiểm tra trắc nghiệm, nhập điểm và tính toán thống kê'
        };
      case 'results':
        return {
          title: 'Kết quả học tập & Phân tích',
          subtitle: 'Biểu đồ phân bố điểm, xếp hạng học sinh và phổ điểm'
        };
      case 'settings':
        return {
          title: 'Cài đặt hệ thống',
          subtitle: 'Thông tin giáo viên, năm học và quản lý dữ liệu'
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  const handleNotificationClick = (tab?: string) => {
    if (tab) {
      setActiveTab(tab as ActiveTab);
    }
    setIsNotifOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Left side: Mobile Hamburger + Titles */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate tracking-tight">
            {title}
          </h1>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline truncate">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Right side: Global Search + Notifications + Teacher Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Search Button */}
        <button
          type="button"
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/60 shadow-2xs"
          title="Tìm kiếm nhanh (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="hidden md:inline">Tìm kiếm học sinh, lớp, bài tập...</span>
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white rounded border border-slate-300 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">Thông báo</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Đã đọc tất cả
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Không có thông báo nào
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.linkTab) handleNotificationClick(notif.linkTab);
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                        !notif.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !notif.read ? 'bg-indigo-600' : 'bg-transparent'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setActiveTab('results');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 w-full"
                >
                  Xem phân tích kết quả học tập
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Teacher Avatar & Greeting */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 cursor-pointer group"
          title="Thông tin giáo viên & Cài đặt"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:ring-2 group-hover:ring-indigo-400 transition-all">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {teacherProfile.name}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {teacherProfile.subject}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
