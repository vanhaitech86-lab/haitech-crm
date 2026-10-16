'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Tag,
  FileText,
  Brain,
  AlarmClock,
  Plus,
  X,
  ExternalLink,
  Kanban,
  CheckCircle2,
} from 'lucide-react';
import { Contact, Task } from '@/types/crm';

interface ContactPanelProps {
  contact: Contact | undefined;
  tasks: Task[];
  onUpdateContact: (partial: Partial<Contact>) => void;
  onAddMemory: (memory: string) => void;
  onOpenNewDealModal: () => void;
  onOpenNewTaskModal: () => void;
  onClose: () => void;
  onViewTimeline?: () => void;
}

export const ContactPanel: React.FC<ContactPanelProps> = ({
  contact,
  tasks,
  onUpdateContact,
  onAddMemory,
  onOpenNewDealModal,
  onOpenNewTaskModal,
  onClose,
  onViewTimeline,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pipelineStage, setPipelineStage] = useState('Mới tiếp cận');
  const [notes, setNotes] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [newMemoryInput, setNewMemoryInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (contact) {
      setName(contact.name || '');
      setPhone(contact.phone || '');
      setEmail(contact.email || '');
      setPipelineStage(contact.pipelineStage || 'Mới tiếp cận');
      setNotes(contact.notes || '');
    }
  }, [contact]);

  if (!contact) {
    return (
      <div className="w-[340px] bg-white border-l border-[#E2E8E5] p-6 text-center text-stone-400 text-xs">
        Chưa có thông tin khách hàng.
      </div>
    );
  }

  const handleBlurSave = () => {
    onUpdateContact({
      name,
      phone,
      email,
      pipelineStage,
      notes,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const updatedTags = [...(contact.tags || []), newTagInput.trim()];
      onUpdateContact({ tags: updatedTags });
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = (contact.tags || []).filter((t) => t !== tagToRemove);
    onUpdateContact({ tags: updatedTags });
  };

  const handleAddMemory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newMemoryInput.trim()) {
      e.preventDefault();
      onAddMemory(newMemoryInput.trim());
      setNewMemoryInput('');
    }
  };

  const contactTasks = tasks.filter((t) => t.contactId === contact.id);

  return (
    <div className="w-[340px] flex-shrink-0 bg-white border-l border-[#DCE6EF] flex flex-col h-full overflow-y-auto p-4 text-xs select-none">
      {/* Header matching reference */}
      <div className="flex items-start justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-sky-100 text-[#0284C7] font-bold text-base flex items-center justify-center border border-sky-200 flex-shrink-0">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm leading-tight">
              {contact.name}
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Khách từ {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Form */}
      <div className="space-y-3.5 py-4 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-stone-800 text-xs">Hồ sơ</h4>
          {isSaved && (
            <span className="text-[10px] text-sky-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Đã lưu
            </span>
          )}
        </div>

        {/* Tên */}
        <div>
          <label className="text-[11px] text-stone-500 font-medium block mb-1">
            Tên
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleBlurSave}
            className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="text-[11px] text-stone-500 font-medium block mb-1">
            Số điện thoại
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={handleBlurSave}
            placeholder="Chưa có SĐT..."
            className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-[11px] text-stone-500 font-medium block mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlurSave}
            placeholder="Chưa có Email..."
            className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* Giai đoạn pipeline */}
        <div>
          <label className="text-[11px] text-stone-500 font-medium block mb-1">
            Giai đoạn
          </label>
          <select
            value={pipelineStage}
            onChange={(e) => {
              setPipelineStage(e.target.value);
              onUpdateContact({ pipelineStage: e.target.value });
            }}
            className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 bg-white focus:outline-none focus:border-[#0284C7]"
          >
            <option value="Mới tiếp cận">Mới tiếp cận</option>
            <option value="Khảo sát / Tư vấn">Khảo sát / Tư vấn</option>
            <option value="Báo giá & Đề xuất">Báo giá & Đề xuất</option>
            <option value="Đàm phán">Đàm phán</option>
            <option value="Ký hợp đồng / Chốt đơn">Ký hợp đồng / Chốt đơn</option>
            <option value="Thất bại / Huỷ">Thất bại / Huỷ</option>
          </select>
        </div>

        {/* Thẻ (Tags) */}
        <div>
          <label className="text-[11px] text-stone-500 font-medium block mb-1">
            Thẻ
          </label>
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {contact.tags?.map((t) => (
              <span
                key={t}
                className="bg-sky-50 text-[#0284C7] border border-sky-200 px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Thêm thẻ rồi Enter"
            className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className="text-[11px] text-stone-500 font-medium block mb-1">
            Ghi chú
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleBlurSave}
            placeholder="Nhập ghi chú khách hàng..."
            className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#0284C7] resize-none"
          />
        </div>
      </div>

      {/* AI Ghi Nhớ Về Khách (matching reference) */}
      <div className="py-4 border-b border-stone-100 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-stone-800 text-xs">
          <Brain className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>AI ghi nhớ về khách ({contact.aiMemories?.length || 0})</span>
        </div>

        {contact.aiMemories && contact.aiMemories.length > 0 ? (
          <ul className="space-y-1.5 pl-1">
            {contact.aiMemories.map((mem, idx) => (
              <li
                key={idx}
                className="text-[11px] text-stone-700 bg-[#F0F6FA] p-2 rounded-xl border border-sky-100 leading-relaxed flex items-start gap-1.5"
              >
                <span className="text-[#0284C7] font-bold">•</span>
                <span>{mem}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[11px] text-stone-400 italic">
            Chưa có. Subagent sẽ tự ghi khi trò chuyện.
          </p>
        )}

        <input
          type="text"
          value={newMemoryInput}
          onChange={(e) => setNewMemoryInput(e.target.value)}
          onKeyDown={handleAddMemory}
          placeholder="Thêm điều cần nhớ rồi Enter"
          className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#0284C7]"
        />
      </div>

      {/* Nhắc Việc (matching reference) */}
      <div className="py-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 text-xs">
            <AlarmClock className="w-3.5 h-3.5 text-amber-600" />
            <span>Nhắc việc</span>
          </div>
          <button
            onClick={onOpenNewTaskModal}
            className="text-[11px] font-semibold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-0.5"
          >
            <Plus className="w-3.5 h-3.5" /> Hẹn nhắc
          </button>
        </div>

        {contactTasks.length > 0 ? (
          <div className="space-y-1.5">
            {contactTasks.map((t) => (
              <div
                key={t.id}
                className="p-2 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-2"
              >
                <div>
                  <h5 className="font-medium text-stone-800 text-[11px]">{t.title}</h5>
                  <span className="text-[10px] text-stone-500 font-normal">
                    {t.dueDate}
                  </span>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    t.priority === 'urgent'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-stone-400 italic">Không có nhắc việc.</p>
        )}
      </div>

      {/* Bottom Quick Deal CTA */}
      <div className="mt-auto pt-3 border-t border-stone-200 flex flex-col gap-2">
        <button
          onClick={onOpenNewDealModal}
          className="w-full py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
        >
          <Kanban className="w-3.5 h-3.5" />
          <span>Tạo Deal vào Pipeline</span>
        </button>

        {onViewTimeline && (
          <button
            onClick={onViewTimeline}
            className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Xem toàn bộ Timeline CRM</span>
          </button>
        )}
      </div>
    </div>
  );
};
