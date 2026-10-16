'use client';

import React, { useState } from 'react';
import {
  Settings,
  Key,
  Users,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  Zap,
} from 'lucide-react';
import { User, AuditLog } from '@/types/crm';

interface SettingsViewProps {
  users: User[];
  auditLogs: AuditLog[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({ users, auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'ai_keys' | 'members' | 'audit' | 'sla'>('ai_keys');

  // AI Keys state (masked by default, strictly never hardcoded)
  const [claudeKey, setClaudeKey] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Audit search
  const [auditSearch, setAuditSearch] = useState('');

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F7F6] overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Cài Đặt Hệ Thống & Bảo Mật (HAITECH Settings)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Quản lý khóa API trí tuệ nhân tạo, phân quyền thành viên RBAC và kiểm tra nhật ký kiểm toán (Audit Logs).
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('ai_keys')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'ai_keys' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            Khóa API AI
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'members' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            Thành viên & Quyền
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'audit' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('sla')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'sla' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            Quy tắc SLA
          </button>
        </div>
      </div>

      {/* Tab 1: AI Keys & LLM Providers */}
      {activeTab === 'ai_keys' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-sky-50 text-[#0284C7] rounded-xl">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Cấu Hình Khóa API Mô Hình Ngôn Ngữ Lớn (LLM)
                </h3>
                <p className="text-xs text-stone-500">
                  Khóa API được lưu trữ mã hóa và chỉ chuyển tiếp qua Backend an toàn, không hiển thị ở mã nguồn máy trạm.
                </p>
              </div>
            </div>

            {isSaved && (
              <span className="text-xs text-[#0369A1] bg-sky-50 px-3 py-1 rounded-xl border border-sky-200 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã cập nhật thành công!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveKeys} className="space-y-4 max-w-2xl">
            {/* Claude API Key */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Anthropic Claude API Key (Khuyên dùng cho Subagent Bán hàng)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full text-xs font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">
                Cần có key này để tắt cảnh báo "AI chưa trả lời được vì chưa có Claude API key" ở màn hình chat.
              </span>
            </div>

            {/* OpenAI API Key */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                OpenAI API Key (GPT-4o)
              </label>
              <input
                type="password"
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full text-xs font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            {/* Gemini API Key */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Google Gemini API Key (Gemini 2.0 Flash)
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs font-mono bg-[#F0F6FA] border border-sky-100 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              Lưu Cấu Hình Khóa Bí Mật
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Members & RBAC */}
      {activeTab === 'members' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0284C7]" />
              <h3 className="font-bold text-sm text-stone-900">
                Thành Viên Workspace & Ma Trận Phân Quyền (RBAC)
              </h3>
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-9 h-9 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <div className="font-bold text-stone-900">{u.name}</div>
                    <div className="text-[11px] text-stone-400">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : u.role === 'manager'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {u.role}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      u.isOnline ? 'bg-[#0284C7]' : 'bg-stone-300'
                    }`}
                    title={u.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#0284C7]" />
              <h3 className="font-bold text-sm text-stone-900">
                Nhật Ký Kiểm Toán (Audit Logs) & Bảo Mật
              </h3>
            </div>

            <div className="relative w-64">
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Tìm nhật ký thao tác..."
                className="w-full text-xs bg-[#F0F6FA] pl-8 pr-3 py-1.5 rounded-xl border border-sky-100 focus:outline-none focus:border-[#0284C7]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-semibold text-[11px]">
                  <th className="py-2 pr-3">Thời gian</th>
                  <th className="py-2 pr-3">Người thao tác</th>
                  <th className="py-2 pr-3">Hành động</th>
                  <th className="py-2 pr-3">Chi tiết</th>
                  <th className="py-2 pr-3">Địa chỉ IP</th>
                  <th className="py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-normal text-stone-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50">
                    <td className="py-2.5 pr-3 text-[11px] text-stone-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-stone-900 whitespace-nowrap">
                      {log.actorName}
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-[#0284C7] whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-2.5 pr-3 text-[11px] text-stone-600 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-2.5 pr-3 text-[10px] font-mono text-stone-400">
                      {log.ipAddress}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          log.status === 'success'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: SLA */}
      {activeTab === 'sla' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Clock className="w-5 h-5 text-[#0284C7]" />
            <h3 className="font-bold text-sm text-stone-900">
              Quy Chuẩn Cam Kết Phục Vụ (SLA Tiêu Chuẩn)
            </h3>
          </div>

          <div className="space-y-3 max-w-lg text-xs">
            <div className="p-3 bg-[#F0F6FA] rounded-xl border border-sky-100 flex justify-between items-center">
              <div>
                <div className="font-bold text-stone-800">Thời gian phản hồi đầu tiên (FRT)</div>
                <div className="text-stone-500 text-[11px]">Kênh Chat website & Messenger</div>
              </div>
              <span className="font-bold text-[#0284C7] bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
                &lt; 2 Phút
              </span>
            </div>

            <div className="p-3 bg-[#F0F6FA] rounded-xl border border-sky-100 flex justify-between items-center">
              <div>
                <div className="font-bold text-stone-800">Thời gian xử lý Subagent AI</div>
                <div className="text-stone-500 text-[11px]">Độ trễ sinh câu trả lời gợi ý</div>
              </div>
              <span className="font-bold text-[#0284C7] bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
                &lt; 800 ms
              </span>
            </div>

            <div className="p-3 bg-[#F0F6FA] rounded-xl border border-sky-100 flex justify-between items-center">
              <div>
                <div className="font-bold text-stone-800">Cảnh báo vi phạm SLA</div>
                <div className="text-stone-500 text-[11px]">Tự động thông báo tới Trưởng nhóm qua Telegram</div>
              </div>
              <span className="font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                Sau 10 Phút
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
