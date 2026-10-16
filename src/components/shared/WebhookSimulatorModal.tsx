'use client';

import React, { useState } from 'react';
import { X, Zap, CheckCircle2, MessageSquare, Radio } from 'lucide-react';
import { ChannelType, ChannelConnector } from '@/types/crm';
import { ChannelBadge } from '../inbox/ChannelBadge';

interface WebhookSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectors: ChannelConnector[];
  onTriggerWebhook: (connectorId: string, customerName: string, text: string) => void;
}

export const WebhookSimulatorModal: React.FC<WebhookSimulatorModalProps> = ({
  isOpen,
  onClose,
  connectors,
  onTriggerWebhook,
}) => {
  const [selectedConnectorId, setSelectedConnectorId] = useState(connectors[0]?.id || '');
  const [customerName, setCustomerName] = useState('Nguyễn Văn Tuấn (Khách Mới)');
  const [messageText, setMessageText] = useState('Chào shop, mình quan tâm đến gói HAITECH CRM, tư vấn giúp mình với!');
  const [isSimulating, setIsSimulating] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleFire = () => {
    if (!messageText.trim()) return;
    setIsSimulating(true);

    setTimeout(() => {
      onTriggerWebhook(selectedConnectorId, customerName, messageText.trim());
      setIsSimulating(false);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 1000);
    }, 400);
  };

  const selectedConn = connectors.find((c) => c.id === selectedConnectorId) || connectors[0];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-crm-modal w-full max-w-lg overflow-hidden animate-message text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-[#FAFCFB]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Trình Mô Phỏng Webhook Đa Kênh (Webhook Sandbox)
              </h3>
              <p className="text-[11px] text-stone-500">
                Gửi sự kiện Inbound webhook giả lập từ Meta, Zalo, Telegram, TikTok hoặc Website.
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

        {/* Content */}
        <div className="p-5 space-y-4">
          {successNotice && (
            <div className="bg-sky-50 border border-sky-200 text-[#0369A1] p-3 rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
              <span>Sự kiện Webhook đã được tiếp nhận và xuất hiện ngay trong Hộp thư!</span>
            </div>
          )}

          {/* Select Connector */}
          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Kênh nguồn tiếp nhận sự kiện (Provider Connector)
            </label>
            <select
              value={selectedConnectorId}
              onChange={(e) => setSelectedConnectorId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 bg-white focus:outline-none focus:border-[#0284C7]"
            >
              {connectors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.accountName} ({c.type})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Tên khách hàng người gửi
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Message Payload */}
          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">
              Nội dung tin nhắn khách gửi (Payload Text)
            </label>
            <textarea
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Nhập nội dung khách hàng gửi đến..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:border-[#0284C7] resize-none"
            />
          </div>

          {/* Raw JSON Preview */}
          <div className="bg-[#0A2239] p-3 rounded-xl text-[10px] font-mono text-sky-300 overflow-x-auto">
            <div>// Payload mẫu chuẩn OpenAPI</div>
            <pre>
              {JSON.stringify(
                {
                  event: 'messages.inbound',
                  provider: selectedConn.type,
                  account_id: selectedConn.id,
                  sender: { name: customerName },
                  message: { text: messageText, timestamp: new Date().toISOString() },
                },
                null,
                2
              )}
            </pre>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleFire}
              disabled={isSimulating || !messageText.trim()}
              className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl font-bold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Đang bắn Webhook...' : 'Kích Hoạt Webhook'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
