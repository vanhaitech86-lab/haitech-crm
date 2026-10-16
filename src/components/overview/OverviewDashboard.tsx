'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  MessageSquare,
  Users,
  DollarSign,
  Clock,
  ShieldCheck,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { CrmStats, Conversation, Deal } from '@/types/crm';

interface OverviewDashboardProps {
  stats: CrmStats;
  conversations: Conversation[];
  deals: Deal[];
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  conversations,
  deals,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'month'>('30d');
  const [exportNotice, setExportNotice] = useState(false);

  const handleExportCsv = () => {
    // Generate CSV string
    const headers = 'ID,KhachHang,Kenh,TrangThai,NguoiPhuTrach,ThoiGian\n';
    const rows = conversations
      .map(
        (c) =>
          `"${c.id}","${c.customerName}","${c.channel}","${c.status}","${c.assigneeName || ''}","${c.lastMessageTime}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `haitech_crm_conversations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F7F6] overflow-y-auto p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Tổng Quan Hiệu Suất HAITECH CRM
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Báo cáo tổng hợp hội thoại đa kênh, tiến độ chốt đơn pipeline và hiệu suất hỗ trợ của AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                timeRange === '7d' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                timeRange === '30d' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              30 ngày qua
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                timeRange === 'month' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Tháng này
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="bg-sky-50 border border-sky-200 text-[#0369A1] p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
          <span>Tệp CSV đã được tải xuống máy tính thành công!</span>
        </div>
      )}

      {/* KPI 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Conversations */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-2">
            <span>Tổng hội thoại</span>
            <span className="p-2 bg-sky-50 text-[#0284C7] rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-stone-900 mb-1">
            {stats.totalConversations}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#0284C7] font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% so với kỳ trước</span>
          </div>
        </div>

        {/* Card 2: Contacts */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-2">
            <span>Khách hàng trong CRM</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-stone-900 mb-1">
            {stats.totalContacts.toLocaleString('vi-VN')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold">
            <span>+{stats.newContactsThisMonth} khách mới tháng này</span>
          </div>
        </div>

        {/* Card 3: Pipeline Value */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-2">
            <span>Doanh thu Pipeline</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-stone-900 mb-1">
            {(stats.pipelineTotalValue / 1000000).toFixed(0)} Triệu đ
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold">
            <span>{deals.length} cơ hội đang đàm phán</span>
          </div>
        </div>

        {/* Card 4: SLA & AI Assist */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-2">
            <span>Tuân thủ SLA & AI</span>
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-stone-900 mb-1">
            {stats.slaComplianceRate}%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-purple-600 font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>AI hỗ trợ: {stats.aiAssistedRate}% phản hồi</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm">
          <h3 className="font-bold text-sm text-stone-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0284C7]" />
            <span>Phân Bổ Kênh Hội Thoại</span>
          </h3>

          <div className="space-y-3.5">
            {[
              { name: 'Facebook Messenger', count: 104, pct: 73, color: 'bg-blue-600' },
              { name: 'Zalo cá nhân & OA', count: 6, pct: 14, color: 'bg-teal-600' },
              { name: 'Website Live Widget', count: 2, pct: 5, color: 'bg-amber-500' },
              { name: 'Telegram Bot', count: 1, pct: 4, color: 'bg-sky-500' },
              { name: 'TikTok Shop Direct', count: 1, pct: 4, color: 'bg-stone-900' },
            ].map((ch) => (
              <div key={ch.name}>
                <div className="flex items-center justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>{ch.name}</span>
                  <span className="text-stone-500 font-semibold">
                    {ch.count} ({ch.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${ch.color} rounded-full`}
                    style={{ width: `${ch.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Leaderboard */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E5] shadow-sm">
          <h3 className="font-bold text-sm text-stone-900 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0284C7]" />
            <span>Hiệu Suất Chuyên Viên & Subagent</span>
          </h3>

          <div className="divide-y divide-stone-100">
            {[
              {
                name: 'HAITECH AI',
                role: 'Trưởng nhóm B2B',
                handled: 68,
                avgSpeed: '1.2 phút',
                csat: '4.9 ★',
              },
              {
                name: 'HAITECH Subagent (AI)',
                role: 'Trợ lý AI Tự Động',
                handled: 45,
                avgSpeed: '0.4 giây',
                csat: '4.8 ★',
              },
              {
                name: 'Trần Thị Hồng Nhung',
                role: 'Chuyên viên CSKH',
                handled: 39,
                avgSpeed: '2.1 phút',
                csat: '4.9 ★',
              },
              {
                name: 'Nguyễn Hoàng Nam',
                role: 'Kinh doanh Doanh nghiệp',
                handled: 22,
                avgSpeed: '2.5 phút',
                csat: '4.7 ★',
              },
            ].map((agent, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-stone-900">{agent.name}</div>
                  <div className="text-[10px] text-stone-400">{agent.role}</div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="font-bold text-stone-800">{agent.handled}</div>
                    <div className="text-[10px] text-stone-400">hội thoại</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#0284C7]">{agent.avgSpeed}</div>
                    <div className="text-[10px] text-stone-400">tốc độ</div>
                  </div>
                  <div>
                    <div className="font-bold text-amber-600">{agent.csat}</div>
                    <div className="text-[10px] text-stone-400">đánh giá</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
