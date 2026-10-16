'use client';

import React, { useState } from 'react';
import { X, AlarmClock, Calendar, User, Flag } from 'lucide-react';
import { Contact, Deal } from '@/types/crm';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (taskData: {
    title: string;
    description?: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    contactId?: string;
    contactName?: string;
    dealId?: string;
    dealTitle?: string;
  }) => void;
  contact?: Contact;
  deals?: Deal[];
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  contact,
  deals = [],
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('Hôm nay, 16:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [selectedDealId, setSelectedDealId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const deal = deals.find((d) => d.id === selectedDealId);

    onCreateTask({
      title: title.trim(),
      description,
      dueDate,
      priority,
      contactId: contact?.id,
      contactName: contact?.name,
      dealId: deal?.id,
      dealTitle: deal?.title,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-crm-modal w-full max-w-md overflow-hidden animate-message text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#FAFCFB]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <AlarmClock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">
              Hẹn Nhắc Chăm Sóc Khách Hàng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {contact && (
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 font-medium text-[11px]">
              Khách hàng liên kết: <span className="font-bold">{contact.name}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Tiêu đề nhắc việc *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Gọi lại tư vấn báo giá chiết khấu đại lý..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Thời hạn hoàn thành
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="Hôm nay, 15:30"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Mức độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 bg-white focus:outline-none focus:border-[#0284C7]"
              >
                <option value="low">Thấp (Low)</option>
                <option value="medium">Bình thường (Normal)</option>
                <option value="high">Quan trọng (High)</option>
                <option value="urgent">Khẩn cấp (Urgent)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Ghi chú nội dung trao đổi
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú chi tiết yêu cầu khách dặn..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:border-[#0284C7] resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold shadow-sm transition-colors"
            >
              Lưu Lịch Hẹn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
