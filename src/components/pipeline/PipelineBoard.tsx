'use client';

import React, { useState } from 'react';
import {
  PipelineStage,
  Deal,
  ChannelType,
} from '@/types/crm';
import {
  Plus,
  DollarSign,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { ChannelBadge } from '../inbox/ChannelBadge';

interface PipelineBoardProps {
  stages: PipelineStage[];
  deals: Deal[];
  onUpdateDealStage: (dealId: string, newStageId: string) => void;
  onOpenNewDealModal: () => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  stages,
  deals,
  onUpdateDealStage,
  onOpenNewDealModal,
}) => {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const handleDragStart = (dealId: string) => {
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (draggedDealId) {
      onUpdateDealStage(draggedDealId, stageId);
      setDraggedDealId(null);
    }
  };

  // Total pipeline value
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F7F6] overflow-hidden">
      {/* Header Bar */}
      <div className="bg-white border-b border-[#E2E8E5] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-stone-900">
              Pipeline Bán Hàng & Chốt Đơn
            </h2>
            <span className="text-xs bg-sky-50 text-[#0284C7] border border-sky-200 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Tổng: {totalValue.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Kéo thả cơ hội giữa các giai đoạn để tự động cập nhật xác suất thành công và kích hoạt quy trình tự động.
          </p>
        </div>

        <button
          onClick={onOpenNewDealModal}
          className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Cơ Hội Mới</span>
        </button>
      </div>

      {/* Kanban Board Horizontal Scroll Columns */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-4 items-start select-none">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stageId === stage.id);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
              className="w-80 flex-shrink-0 bg-[#EAF2F8]/70 rounded-2xl p-3 border border-sky-100 flex flex-col max-h-full"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/80">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  ></span>
                  <h3 className="font-bold text-xs text-stone-800">{stage.name}</h3>
                  <span className="text-[11px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full border border-stone-200">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-stone-500">
                  {stage.probability}%
                </span>
              </div>

              {/* Stage Subtotal */}
              <div className="text-[11px] text-stone-500 mb-2 font-medium">
                {stageValue > 0 ? `${stageValue.toLocaleString('vi-VN')} đ` : '0 đ'}
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                {stageDeals.length === 0 ? (
                  <div className="py-8 text-center text-stone-400 text-[11px] border-2 border-dashed border-stone-200 rounded-xl">
                    Kéo cơ hội vào đây
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:border-[#0284C7]"
                    >
                      {/* Deal Title */}
                      <h4 className="font-bold text-xs text-stone-900 mb-1.5 leading-snug">
                        {deal.title}
                      </h4>

                      {/* Value VNĐ */}
                      <div className="text-sm font-extrabold text-[#0284C7] mb-2 flex items-center gap-1">
                        <span>{deal.value.toLocaleString('vi-VN')} đ</span>
                      </div>

                      {/* Contact Info */}
                      <div className="text-[11px] text-stone-600 font-medium mb-2 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span className="truncate">{deal.contactName}</span>
                      </div>

                      {/* Footer: Date & Source */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{deal.expectedCloseDate}</span>
                        </div>
                        <ChannelBadge
                          type={deal.channelSource}
                          showIconOnly={true}
                          className="scale-90"
                        />
                      </div>

                      {/* Move to next stage quick button */}
                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex justify-end">
                        <select
                          value={deal.stageId}
                          onChange={(e) => onUpdateDealStage(deal.id, e.target.value)}
                          className="text-[10px] font-medium bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-stone-600 focus:outline-none"
                        >
                          {stages.map((s) => (
                            <option key={s.id} value={s.id}>
                              → {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
