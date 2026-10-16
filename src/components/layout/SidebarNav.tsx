'use client';

import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  MessageSquareShare,
  Users,
  Kanban,
  Bot,
  BookOpen,
  AlarmClock,
  Radio,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'inbox'
  | 'interactions'
  | 'contacts'
  | 'pipeline'
  | 'subagents'
  | 'knowledge'
  | 'tasks'
  | 'channels'
  | 'settings'
  | 'admin';

interface SidebarNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount?: number;
  taskAlertCount?: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onSelectTab,
  unreadCount = 5,
  taskAlertCount = 2,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'inbox',
      label: 'Hộp thư',
      icon: <Inbox className="w-5 h-5" />,
      badge: unreadCount,
    },
    {
      id: 'interactions',
      label: 'Tương tác',
      icon: <MessageSquareShare className="w-5 h-5" />,
    },
    {
      id: 'contacts',
      label: 'Khách',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: <Kanban className="w-5 h-5" />,
    },
    {
      id: 'subagents',
      label: 'Subagent',
      icon: <Bot className="w-5 h-5" />,
    },
    {
      id: 'knowledge',
      label: 'Kiến thức',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'tasks',
      label: 'Nhắc việc',
      icon: <AlarmClock className="w-5 h-5" />,
      badge: taskAlertCount > 0 ? taskAlertCount : undefined,
    },
    {
      id: 'channels',
      label: 'Kênh',
      icon: <Radio className="w-5 h-5" />,
    },
    {
      id: 'admin',
      label: 'Quản trị',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-[104px] bg-[#0A2239] flex flex-col items-center py-3 select-none flex-shrink-0 z-30 shadow-md text-white/80">
      {/* Brand Logo matching reference */}
      <div
        onClick={() => onSelectTab('inbox')}
        className="cursor-pointer mb-3 flex flex-col items-center group transition-transform active:scale-95"
      >
        <div className="w-14 h-11 bg-[#0284C7] rounded-xl flex items-center justify-center border border-[#38BDF8]/40 shadow-inner group-hover:bg-[#0369A1] transition-colors">
          <span className="text-white font-extrabold text-sm tracking-wider flex items-center gap-0.5">
            <span className="text-sky-200 text-base">H</span>CRM
          </span>
        </div>
        <span className="text-[10px] text-sky-400 font-semibold tracking-widest mt-1 opacity-90">
          HAITECH
        </span>
      </div>

      {/* Navigation Menu List */}
      <nav className="flex-1 w-full flex flex-col gap-1 items-center px-1 overflow-y-auto overflow-x-hidden scrollbar-none py-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id || (item.id === 'admin' && currentTab === 'settings');
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-150 group ${
                isActive
                  ? 'bg-[#0284C7] text-white shadow-sm font-medium border border-[#38BDF8]/50'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1.5 right-4 min-w-[18px] h-[18px] px-1 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}

              <div
                className={`transition-transform duration-150 group-hover:scale-105 ${
                  isActive ? 'text-sky-200' : 'text-stone-400 group-hover:text-stone-200'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] mt-1 text-center tracking-tight leading-none line-clamp-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Admin Portal Shortcut at Bottom */}
      <div className="w-full px-1 pt-2 border-t border-sky-950/60">
        <button
          onClick={() => onSelectTab('admin')}
          className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentTab === 'admin' || currentTab === 'settings'
              ? 'bg-[#0284C7] text-white font-medium border border-[#38BDF8]/50'
              : 'text-stone-300 hover:text-white hover:bg-white/5'
          }`}
          title="Mở Trang Quản Trị Hệ Thống Admin"
        >
          <ShieldCheck
            className={`w-5 h-5 ${
              currentTab === 'admin' || currentTab === 'settings' ? 'text-sky-200' : 'text-stone-400'
            }`}
          />
          <span className="text-[10px] font-bold mt-1 tracking-tight text-center leading-tight">Quản trị Admin</span>
        </button>
      </div>
    </aside>
  );
};
