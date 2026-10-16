'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Tag,
  Building,
  Calendar,
  DollarSign,
  Download,
  Filter,
  CheckCircle2,
  ExternalLink,
  HardDrive,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { Contact, ChannelType } from '@/types/crm';
import { ChannelBadge } from '../inbox/ChannelBadge';

interface ContactsViewProps {
  contacts: Contact[];
  onSelectContactForChat: (contactId: string) => void;
  onOpenNewContactModal?: () => void;
  onOpenGoogleDriveModal?: () => void;
  onDownloadCsv?: () => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onSelectContactForChat,
  onOpenNewContactModal,
  onOpenGoogleDriveModal,
  onDownloadCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      c.tags.some((t) => t.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (selectedChannel !== 'all' && c.leadSource !== selectedChannel) return false;
    return true;
  });

  // Toggle select contact
  const toggleSelect = (id: string) => {
    const next = new Set(selectedContactIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedContactIds(next);
  };

  // Select all / deselect all
  const toggleSelectAll = () => {
    if (selectedContactIds.size === filteredContacts.length) {
      setSelectedContactIds(new Set());
    } else {
      setSelectedContactIds(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const handleDownloadCsv = () => {
    if (onDownloadCsv) {
      onDownloadCsv();
    } else {
      // Fallback client CSV download
      const headers = ['Mã khách', 'Họ tên', 'Số điện thoại', 'Email', 'Công ty', 'Giai đoạn Pipeline', 'Nguồn Lead'];
      const rows = filteredContacts.map((c) => [c.id, `"${c.name}"`, c.phone, c.email, `"${c.company || ''}"`, `"${c.pipelineStage}"`, c.leadSource]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `HAITECH_CRM_Contacts_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F0F6FA] overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCE6EF] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
              Quản Lý Khách Hàng (CRM Contacts & Master Data)
            </h2>
            <span className="text-xs bg-sky-50 text-[#0284C7] border border-sky-200 font-bold px-2.5 py-0.5 rounded-full">
              {contacts.length} Hồ sơ 360° đã xác minh
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Tổng hợp dữ liệu khách hàng hợp nhất từ Zalo, Facebook, TikTok, Website Livechat và hỗ trợ đồng bộ tự động về Google Drive.
          </p>
        </div>

        {/* Action Buttons: Google Drive Sync & Excel Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Google Drive Hub Button */}
          {onOpenGoogleDriveModal && (
            <button
              onClick={onOpenGoogleDriveModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              title="Mở bảng điều khiển đồng bộ dữ liệu về Google Drive & Sheets"
            >
              <HardDrive className="w-4 h-4 text-emerald-200" />
              <span>Đưa Dữ Liệu Về Google Drive</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            </button>
          )}

          {/* Download CSV / Excel */}
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors shadow-sm"
            title="Tải toàn bộ data về máy tính dạng Excel/CSV"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Xuất File Excel</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Source Channels Filter */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedChannel('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedChannel === 'all'
                ? 'bg-[#0284C7] text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Tất cả nguồn ({contacts.length})
          </button>
          <button
            onClick={() => setSelectedChannel('zalo_personal')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedChannel === 'zalo_personal'
                ? 'bg-[#0284C7] text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Zalo
          </button>
          <button
            onClick={() => setSelectedChannel('facebook')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedChannel === 'facebook'
                ? 'bg-[#0284C7] text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Facebook
          </button>
          <button
            onClick={() => setSelectedChannel('website')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedChannel === 'website'
                ? 'bg-[#0284C7] text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Website
          </button>
          <button
            onClick={() => setSelectedChannel('tiktok')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedChannel === 'tiktok'
                ? 'bg-[#0284C7] text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            TikTok
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, SĐT, công ty, tag..."
            className="w-full text-xs bg-white pl-8 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#0284C7] shadow-sm"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Bulk Action Bar (when rows selected) */}
      {selectedContactIds.size > 0 && (
        <div className="bg-[#0A2239] text-white p-3 rounded-2xl flex items-center justify-between text-xs animate-message shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sky-200">
              Đã chọn {selectedContactIds.size} / {filteredContacts.length} khách hàng
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenGoogleDriveModal && (
              <button
                onClick={onOpenGoogleDriveModal}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Đồng Bộ Sang Google Drive</span>
              </button>
            )}

            <button
              onClick={() => setSelectedContactIds(new Set())}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div className="bg-white rounded-2xl border border-[#DCE6EF] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-400 font-semibold text-[11px]">
                <th className="py-3 px-4 w-10">
                  <button onClick={toggleSelectAll} className="text-stone-400 hover:text-stone-700">
                    {selectedContactIds.size === filteredContacts.length && filteredContacts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#0284C7]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Số điện thoại / Email</th>
                <th className="py-3 px-4">Giai đoạn Pipeline</th>
                <th className="py-3 px-4">Nguồn Lead</th>
                <th className="py-3 px-4">Thẻ phân loại</th>
                <th className="py-3 px-4">Phụ trách</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredContacts.map((contact) => {
                const isSelected = selectedContactIds.has(contact.id);
                return (
                  <tr
                    key={contact.id}
                    className={`transition-colors ${isSelected ? 'bg-sky-50/50' : 'hover:bg-stone-50/80'}`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <button onClick={() => toggleSelect(contact.id)} className="text-stone-400 hover:text-stone-700">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#0284C7]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {contact.avatar ? (
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-9 h-9 rounded-full object-cover border border-stone-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-sky-100 text-[#0284C7] font-bold flex items-center justify-center text-xs">
                            {contact.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-stone-900 text-xs">
                            {contact.name}
                          </div>
                          {contact.company && (
                            <div className="text-[10px] text-stone-400 truncate max-w-xs">
                              {contact.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phone & Email */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-stone-800 font-bold">
                        {contact.phone || '—'}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate max-w-xs">
                        {contact.email || '—'}
                      </div>
                    </td>

                    {/* Pipeline Stage */}
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-[#0369A1] bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                        {contact.pipelineStage}
                      </span>
                    </td>

                    {/* Lead Source */}
                    <td className="py-3 px-4">
                      <ChannelBadge type={contact.leadSource} showIconOnly={false} />
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {contact.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-200 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-4 text-[11px] text-stone-600 font-medium">
                      {contact.ownerName}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectContactForChat(contact.id)}
                        className="px-3 py-1 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                      >
                        Mở Chat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
