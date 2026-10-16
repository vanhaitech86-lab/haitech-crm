'use client';

import React, { useState } from 'react';
import { X, DollarSign, Kanban, Calendar, User } from 'lucide-react';
import { PipelineStage, Contact, ChannelType } from '@/types/crm';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeal: (dealData: {
    title: string;
    value: number;
    stageId: string;
    contactId: string;
    contactName: string;
    expectedCloseDate: string;
    channelSource: ChannelType;
    notes?: string;
  }) => void;
  stages: PipelineStage[];
  contacts: Contact[];
  initialContact?: Contact;
}

export const NewDealModal: React.FC<NewDealModalProps> = ({
  isOpen,
  onClose,
  onCreateDeal,
  stages,
  contacts,
  initialContact,
}) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState(50000000);
  const [stageId, setStageId] = useState(stages[0]?.id || 'stage-lead');
  const [selectedContactId, setSelectedContactId] = useState(initialContact?.id || contacts[0]?.id || '');
  const [expectedCloseDate, setExpectedCloseDate] = useState('2026-10-31');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = contacts.find((c) => c.id === selectedContactId) || initialContact;
    if (!title.trim() || !contact) return;

    onCreateDeal({
      title: title.trim(),
      value: Number(value),
      stageId,
      contactId: contact.id,
      contactName: contact.name,
      expectedCloseDate,
      channelSource: contact.leadSource,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-crm-modal w-full max-w-md overflow-hidden animate-message text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#FAFCFB]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-100 text-[#0284C7] rounded-lg">
              <Kanban className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">
              Tạo Cơ Hội Mới (New Deal)
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
          {/* Deal Title */}
          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Tên cơ hội / Dự án hợp đồng *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Hợp đồng cung cấp 20 máy lọc nước..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Value VNĐ */}
          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Giá trị dự kiến (VNĐ)
            </label>
            <input
              type="number"
              step="1000000"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 font-bold focus:outline-none focus:border-[#0284C7]"
            />
            <span className="text-[10px] text-[#0369A1] font-semibold mt-1 block">
              Bằng chữ: {value.toLocaleString('vi-VN')} Việt Nam Đồng
            </span>
          </div>

          {/* Contact select */}
          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Khách hàng liên kết
            </label>
            <select
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 bg-white focus:outline-none focus:border-[#0284C7]"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone || c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Stage & Close Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Giai đoạn ban đầu
              </label>
              <select
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 bg-white focus:outline-none focus:border-[#0284C7]"
              >
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.probability}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Ngày dự kiến chốt
              </label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 bg-white focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Ghi chú thêm
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Yêu cầu chiết khấu, điều khoản thanh toán..."
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
              Lưu Deal vào Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
