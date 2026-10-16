'use client';

import React from 'react';
import {
  RefreshCw,
  Zap,
  ShieldCheck,
  HardDrive,
  CreditCard,
  LogIn,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { User, CommercialTenant } from '@/types/crm';

interface AppHeaderProps {
  currentUser: User;
  currentTenant?: CommercialTenant;
  onResetSeed: () => void;
  onOpenWebhookModal: () => void;
  onNavigateAdmin?: () => void;
  onOpenAuthModal?: (tab?: 'login' | 'register' | 'pricing') => void;
  onOpenGoogleDriveModal?: () => void;
  isResetting?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentUser,
  currentTenant,
  onResetSeed,
  onOpenWebhookModal,
  onNavigateAdmin,
  onOpenAuthModal,
  onOpenGoogleDriveModal,
  isResetting = false,
}) => {
  return (
    <header className="h-13 bg-white border-b border-[#DCE6EF] px-4 flex items-center justify-between z-20 flex-shrink-0 shadow-sm">
      {/* Left: Brand Identity, Commercial Tenant & Mode */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#0284C7] text-base tracking-tight">
            HAITECH CRM
          </span>
          <span className="text-stone-300">/</span>
          <span className="text-xs text-stone-600 font-semibold hidden md:inline">
            Hệ thống Quản lý Đa kênh AI All-in-One
          </span>
        </div>

        {/* Tenant Commercial Badge */}
        {currentTenant ? (
          <div
            onClick={() => onOpenAuthModal?.('pricing')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F0F6FA] text-[#0A2239] border border-sky-200 cursor-pointer hover:border-[#0284C7] transition-all shadow-xs"
            title="Bấm để xem chi tiết gói cước hoặc nâng cấp thuê CRM"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="truncate max-w-[120px] sm:max-w-[180px]">{currentTenant.companyName}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                currentTenant.plan === 'enterprise'
                  ? 'bg-purple-100 text-purple-700'
                  : currentTenant.plan === 'pro'
                  ? 'bg-sky-100 text-[#0284C7]'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {currentTenant.plan === 'enterprise' ? 'Doanh Nghiệp' : currentTenant.plan === 'pro' ? 'Bản Thuê Pro' : 'Dùng Thử'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Chế độ Demo/Sandbox</span>
          </div>
        )}
      </div>

      {/* Right: Commercial Rental CTA, Auth Buttons, Google Drive & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Google Drive Quick Sync Button */}
        {onOpenGoogleDriveModal && (
          <button
            onClick={onOpenGoogleDriveModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[#0A2239] bg-[#F0F6FA] hover:bg-sky-100 border border-sky-200 rounded-xl transition-all shadow-xs"
            title="Đồng bộ toàn bộ data khách hàng về Google Drive & Sheets"
          >
            <HardDrive className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="hidden lg:inline">Google Drive</span>
          </button>
        )}

        {/* Commercial Pricing / Rent CRM Button */}
        {onOpenAuthModal && (
          <button
            onClick={() => onOpenAuthModal('pricing')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-xs transition-all"
            title="Khách hàng thuê CRM hoặc dùng thử trải nghiệm"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thuê CRM</span>
          </button>
        )}

        {/* Login / Register Buttons */}
        {onOpenAuthModal && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenAuthModal('login')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              title="Đăng nhập tài khoản khách hàng hoặc quản trị"
            >
              <LogIn className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="hidden sm:inline">Đăng Nhập</span>
            </button>
            <button
              onClick={() => onOpenAuthModal('register')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors"
              title="Đăng ký tài khoản trải nghiệm 14 ngày miễn phí"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng Ký</span>
            </button>
          </div>
        )}

        {/* Simulate Webhook */}
        <button
          onClick={onOpenWebhookModal}
          className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#0284C7] bg-[#0284C7]/5 hover:bg-[#0284C7]/10 border border-[#0284C7]/20 rounded-xl transition-colors"
          title="Mô phỏng tin nhắn từ Facebook, Zalo, TikTok hoặc Website"
        >
          <Zap className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Webhook Test</span>
        </button>

        {/* Reset Seed Data */}
        <button
          onClick={onResetSeed}
          disabled={isResetting}
          className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors disabled:opacity-50"
          title="Khôi phục lại toàn bộ dữ liệu seed ban đầu"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>Reset</span>
        </button>

        {/* Admin Portal Button */}
        {onNavigateAdmin && (
          <button
            onClick={onNavigateAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-xs rounded-xl transition-colors"
            title="Mở Trang Quản Trị Hệ Thống Admin"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-200" />
            <span className="hidden md:inline">Admin</span>
          </button>
        )}

        {/* User Badge */}
        <div
          onClick={onNavigateAdmin}
          className="flex items-center gap-2 pl-1.5 sm:pl-2.5 border-l border-stone-200 cursor-pointer group"
          title="Bấm để mở Cổng Quản Trị Admin"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-sky-600/30 group-hover:ring-2 group-hover:ring-[#0284C7] transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"></span>
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-stone-800 leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-stone-500 font-medium capitalize">
              {currentUser.role === 'admin' ? 'Quản trị viên' : 'Chuyên viên'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
