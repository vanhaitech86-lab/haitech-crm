'use client';

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Zap,
  ArrowRight,
  Clock,
  Laptop,
} from 'lucide-react';
import { CommercialTenant, SubscriptionPlan, User } from '@/types/crm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'pricing';
  currentTenant?: CommercialTenant;
  currentUser?: User;
  onLogin: (email: any, password?: string) => void;
  onRegister: (data: {
    name: string;
    email: string;
    phone: string;
    companyName: string;
    plan: SubscriptionPlan;
  }) => void;
  onLogout?: () => void;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'register',
  currentTenant,
  currentUser,
  onLogin,
  onRegister,
  onLogout,
  onSelectPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'pricing'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPlan, setRegPlan] = useState<SubscriptionPlan>('trial');

  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    onLogin(loginEmail.trim(), loginPassword);
    setSuccessToast(`Đăng nhập thành công với tài khoản ${loginEmail}!`);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) return;

    onRegister({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      companyName: regCompany.trim() || `${regName.trim()} Brand CRM`,
      plan: regPlan,
    });

    setSuccessToast(
      regPlan === 'trial'
        ? 'Đăng ký trải nghiệm dùng thử 14 ngày thành công!'
        : `Đăng ký thuê gói ${regPlan.toUpperCase()} thành công!`
    );
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border border-[#DCE6EF] shadow-2xl w-full max-w-3xl overflow-hidden animate-message text-xs flex flex-col max-h-[92vh]">
        {/* Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white p-3 text-center font-bold flex items-center justify-center gap-2 animate-message">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#0A2239] via-[#0369A1] to-[#0284C7] p-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-sky-400/20 text-sky-200 border border-sky-300/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                HAITECH CRM Commercial Portal
              </span>
              <span className="text-[11px] text-sky-200">· Nền tảng Đa kênh AI All-in-One</span>
            </div>
            <h2 className="text-lg font-black tracking-tight">
              {activeTab === 'login'
                ? 'Đăng Nhập Tài Khoản Doanh Nghiệp'
                : activeTab === 'register'
                ? 'Đăng Ký Trải Nghiệm & Thuê CRM Đa Kênh'
                : 'Bảng Giá & Gói Dịch Vụ Thuê CRM'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-[#F0F6FA] px-5 pt-2">
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-2.5 px-4 font-bold transition-all border-b-2 text-xs flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2.5 px-4 font-bold transition-all border-b-2 text-xs flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Đăng Ký Dùng Thử 14 Ngày</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`pb-2.5 px-4 font-bold transition-all border-b-2 text-xs flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Bảng Giá Gói Thuê CRM</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* ========================================================================= */}
          {/* TAB: LOGIN                                                                */}
          {/* ========================================================================= */}
          {activeTab === 'login' && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-center">
                <p className="text-stone-600 text-xs">
                  Nhập email quản trị hoặc tài khoản nhân viên đã được cấp quyền để truy cập hệ thống CRM.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Email Đăng Nhập:</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="vd: ai@haitech.vn hoặc khachhang@gmail.com"
                      required
                      className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Mật Khẩu:</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#0284C7] rounded" />
                    <span>Ghi nhớ phiên làm việc (30 ngày)</span>
                  </label>
                  <span className="text-[#0284C7] hover:underline cursor-pointer">Quên mật khẩu?</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Đăng Nhập Vào Hệ Thống</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo quick switch accounts */}
              <div className="pt-3 border-t border-stone-100">
                <span className="text-[11px] font-bold text-stone-500 block mb-2 text-center">
                  Tài khoản dùng thử có sẵn:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('ai@haitech.vn');
                      setLoginPassword('admin123');
                    }}
                    className="p-2 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 text-left transition-colors"
                  >
                    <div className="font-bold text-sky-900">HAITECH AI (Admin)</div>
                    <div className="text-[10px] text-sky-600">ai@haitech.vn</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('nhung.tran@haitech.vn');
                      setLoginPassword('agent123');
                    }}
                    className="p-2 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 text-left transition-colors"
                  >
                    <div className="font-bold text-stone-800">Trần Thị Hồng Nhung</div>
                    <div className="text-[10px] text-stone-500">nhung.tran@haitech.vn</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: REGISTER / FREE TRIAL                                                */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Dành Cho Khách Hàng Trải Nghiệm Hoặc Thuê CRM Thương Mại</span>
                  </h3>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Miễn phí 14 ngày đầy đủ tính năng: Kết nối 4 kênh (Zalo, FB, Web, TikTok), AI Subagent và xuất data về Google Drive.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-emerald-600 text-white font-black text-xs px-3 py-1.5 rounded-xl text-center shadow-sm">
                  14 NGÀY MIỄN PHÍ
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Họ Và Tên Khách Hàng (*):</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="VD: Nguyễn Văn Hoàng"
                        required
                        className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl pl-9 pr-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                      />
                      <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Số Điện Thoại Zalo (*):</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="VD: 098739896"
                        required
                        className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl pl-9 pr-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Email Doanh Nghiệp (*):</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="hoang.nguyen@congty.com"
                        required
                        className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl pl-9 pr-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Tên Công Ty / Cửa Hàng / Thương Hiệu:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        placeholder="VD: Máy Lọc Nước Dakrong"
                        className="w-full bg-[#F0F6FA] border border-sky-100 rounded-xl pl-9 pr-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                      />
                      <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Plan Selection */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1.5">Chọn Gói Trải Nghiệm / Thuê CRM:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div
                      onClick={() => setRegPlan('trial')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        regPlan === 'trial'
                          ? 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-extrabold text-stone-900 flex items-center justify-between">
                        <span>Dùng Thử (Trial)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">0đ</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">14 ngày miễn phí, 3 nhân viên, 4 kênh kết nối.</div>
                    </div>

                    <div
                      onClick={() => setRegPlan('starter')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        regPlan === 'starter'
                          ? 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-extrabold text-stone-900 flex items-center justify-between">
                        <span>Thuê Pro</span>
                        <span className="text-[10px] bg-sky-100 text-[#0284C7] px-1.5 py-0.5 rounded font-bold">990k/tháng</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">5 nhân sự, Full AI Subagent, đẩy data sang Google Drive.</div>
                    </div>

                    <div
                      onClick={() => setRegPlan('enterprise')}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        regPlan === 'enterprise'
                          ? 'bg-sky-50 border-[#0284C7] ring-2 ring-[#0284C7]/20'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="font-extrabold text-stone-900 flex items-center justify-between">
                        <span>Enterprise</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">2.49tr/tháng</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">Không giới hạn nhân viên & kênh, Google Drive Real-time.</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0284C7] flex-shrink-0" />
                  <span>
                    Bảo mật tuyệt đối: Mỗi khách hàng được cấp một Tenant CRM riêng biệt với kho dữ liệu độc lập.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Hoàn Tất Đăng Ký & Khởi Tạo CRM Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: PRICING / COMMERCIAL PLANS                                           */}
          {/* ========================================================================= */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="text-center max-w-lg mx-auto">
                <h3 className="font-black text-sm text-stone-900">
                  Gói Dịch Vụ Thuê CRM Bán Hàng & Chăm Sóc Đa Kênh Tích Hợp AI
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Phù hợp cho các cá nhân kinh doanh, showroom, công ty dịch vụ hoặc triển khai thương mại đa khách hàng.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Plan 1 */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-white flex flex-col justify-between hover:border-sky-300 transition-all">
                  <div>
                    <div className="text-stone-500 font-bold text-[10px] uppercase tracking-wider mb-1">
                      Trải Nghiệm Dùng Thử
                    </div>
                    <div className="text-xl font-black text-stone-900">0 đ</div>
                    <div className="text-[11px] text-stone-400 mb-3">14 ngày trải nghiệm</div>

                    <ul className="space-y-2 text-[11px] text-stone-600 border-t border-stone-100 pt-3">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>3 Tài khoản nhân viên tư vấn</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>4 Kênh (Zalo, FB, Web, TikTok)</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>200 Tin nhắn Subagent AI</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Xuất CSV về máy tính</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setRegPlan('trial');
                      setActiveTab('register');
                    }}
                    className="w-full mt-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition-colors"
                  >
                    Bắt Đầu Dùng Thử
                  </button>
                </div>

                {/* Plan 2: Pro (Best Value) */}
                <div className="p-4 rounded-2xl border-2 border-[#0284C7] bg-sky-50/40 flex flex-col justify-between shadow-md relative">
                  <span className="absolute -top-2.5 right-4 bg-[#0284C7] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    Khuyên Dùng
                  </span>

                  <div>
                    <div className="text-[#0284C7] font-bold text-[10px] uppercase tracking-wider mb-1">
                      Gói Thuê Tiêu Chuẩn (Pro)
                    </div>
                    <div className="text-xl font-black text-stone-900">990.000 đ</div>
                    <div className="text-[11px] text-stone-500 mb-3">/ tháng / doanh nghiệp</div>

                    <ul className="space-y-2 text-[11px] text-stone-700 border-t border-sky-100 pt-3">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold">10 Tài khoản nhân viên</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kết nối không giới hạn Fanpage, Zalo OA</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Không giới hạn Subagent AI</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold text-[#0284C7]">Đồng bộ dữ liệu sang Google Drive</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setRegPlan('starter');
                      setActiveTab('register');
                    }}
                    className="w-full mt-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold transition-colors shadow"
                  >
                    Đăng Ký Thuê Gói Pro
                  </button>
                </div>

                {/* Plan 3: Enterprise */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-white flex flex-col justify-between hover:border-purple-300 transition-all">
                  <div>
                    <div className="text-purple-600 font-bold text-[10px] uppercase tracking-wider mb-1">
                      Doanh Nghiệp (Enterprise)
                    </div>
                    <div className="text-xl font-black text-stone-900">2.490.000 đ</div>
                    <div className="text-[11px] text-stone-400 mb-3">/ tháng / trọn gói</div>

                    <ul className="space-y-2 text-[11px] text-stone-600 border-t border-stone-100 pt-3">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Không giới hạn tài khoản nhân sự</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Google Drive & Sheets Real-time</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Subagent AI riêng tư bảo mật</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Hỗ trợ kỹ thuật 24/7 & SLA 99.9%</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setRegPlan('enterprise');
                      setActiveTab('register');
                    }}
                    className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors"
                  >
                    Đăng Ký Bản Enterprise
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
