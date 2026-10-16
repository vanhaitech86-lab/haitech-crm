'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  FileText,
  Send,
  User as UserIcon,
  CheckCircle2,
  Clock,
  Compass,
  ChevronDown,
  AlertCircle,
  Paperclip,
  Smile,
} from 'lucide-react';
import { Conversation, Message } from '@/types/crm';

interface ConversationViewProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (text: string, isInternalNote: boolean) => void;
  onUpdateConversation: (partial: Partial<Conversation>) => void;
  onToggleProfilePanel: () => void;
  onNavigateSettings: () => void;
  onAiSuggest: () => void;
  aiSuggestion?: { suggestion: string; confidence: number; source: string } | null;
  onApproveAiSuggestion?: (text: string) => void;
  isProfileOpen: boolean;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  messages,
  onSendMessage,
  onUpdateConversation,
  onToggleProfilePanel,
  onNavigateSettings,
  onAiSuggest,
  aiSuggestion,
  onApproveAiSuggestion,
  isProfileOpen,
}) => {
  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setIsSending(true);
    onSendMessage(inputText.trim(), isInternalNote);
    setInputText('');
    setIsInternalNote(false);
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F0F6FA] overflow-hidden">
      {/* Header matching reference image */}
      <div className="h-16 bg-white border-b border-[#DCE6EF] px-4 flex items-center justify-between flex-shrink-0">
        {/* Left: Avatar & Title & Channel */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-sky-100 text-[#0284C7] font-bold flex items-center justify-center border border-sky-200 text-sm flex-shrink-0">
            {conversation.customerName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-stone-900 truncate">
              {conversation.customerName}
            </h3>

            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500 text-white flex items-center gap-1">
                <span>
                  {conversation.channel === 'zalo_personal'
                    ? `Zalo cá nhân · ${conversation.assigneeName || 'HAITECH AI'}`
                    : conversation.channel === 'facebook'
                    ? `Facebook Messenger · ${conversation.channelAccountName}`
                    : conversation.channel}
                </span>
              </span>

              {conversation.isGroup && (
                <span className="text-[11px] text-stone-400 font-medium">nhóm</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Auto-reply Toggle, Auto-dispatch, Status, Profile */}
        <div className="flex items-center gap-3">
          {/* AI Auto-reply switch */}
          <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-200">
            <label className="text-xs font-medium text-stone-700 cursor-pointer flex items-center gap-2">
              <span>AI tự trả lời</span>
              <button
                type="button"
                role="switch"
                aria-checked={conversation.aiAutoReply}
                onClick={() =>
                  onUpdateConversation({ aiAutoReply: !conversation.aiAutoReply })
                }
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  conversation.aiAutoReply ? 'bg-[#D8A13A]' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    conversation.aiAutoReply ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Auto dispatch button/select */}
          <button
            onClick={() =>
              onUpdateConversation({ aiAutoDispatch: !conversation.aiAutoDispatch })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
              conversation.aiAutoDispatch
                ? 'bg-stone-100 text-stone-800 border-stone-300'
                : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-stone-500" />
            <span>Tự điều phối</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {/* Status Dropdown */}
          <select
            value={conversation.status}
            onChange={(e) =>
              onUpdateConversation({ status: e.target.value as any })
            }
            className="text-xs font-medium bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-stone-700 focus:outline-none focus:border-[#0284C7]"
          >
            <option value="open">Đang mở</option>
            <option value="in_progress">Đang xử lý</option>
            <option value="waiting">Chờ khách</option>
            <option value="closed">Đã đóng</option>
          </select>

          {/* Toggle Profile Panel */}
          <button
            onClick={onToggleProfilePanel}
            className={`p-2 rounded-xl border transition-colors ${
              isProfileOpen
                ? 'bg-[#0284C7] text-white border-[#0284C7]'
                : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
            }`}
            title="Mở hồ sơ khách hàng"
          >
            <UserIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Honest Warning Banner when API Key is missing - exactly matching reference */}
      <div className="bg-[#FEF9C3] border-b border-[#FDE047] px-4 py-2 flex items-center justify-between text-xs text-[#854D0E]">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#D8A13A] flex-shrink-0" />
          <span>
            AI chưa trả lời được vì chưa có Claude API key.{' '}
            <button
              onClick={onNavigateSettings}
              className="font-semibold underline hover:text-[#713F12]"
            >
              Nhập ở Cài đặt.
            </button>
          </span>
        </div>
        <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-medium">
          Sandbox Demo
        </span>
      </div>

      {/* Messages Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date divider */}
        <div className="flex items-center justify-center my-2">
          <span className="text-[11px] font-medium text-stone-500 bg-stone-200/80 px-3 py-0.5 rounded-full">
            Thứ Sáu, 16/10
          </span>
        </div>

        {/* Messages */}
        {messages.map((msg) => {
          const isAgent = msg.senderType === 'agent';
          const isAi = msg.senderType === 'ai';
          const isNote = msg.isInternalNote;

          if (isNote) {
            return (
              <div
                key={msg.id}
                className="mx-auto max-w-lg bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] p-3 rounded-2xl shadow-sm animate-message text-xs"
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ghi chú nội bộ · {msg.senderName}</span>
                  <span className="text-[10px] text-amber-700 ml-auto font-normal">
                    {msg.createdAt}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            );
          }

          if (isAi) {
            return (
              <div key={msg.id} className="flex flex-col items-start max-w-xl animate-message">
                <div className="flex items-center gap-1.5 mb-1 pl-1">
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-sky-700" />
                    AI Subagent ({msg.metadata?.aiModel || 'Claude 3.7 Sonnet'})
                  </span>
                  <span className="text-[10px] text-stone-400">{msg.createdAt}</span>
                </div>
                <div className="bg-white border-2 border-sky-300/80 text-stone-800 p-3.5 rounded-2xl rounded-tl-sm shadow-sm text-xs leading-relaxed">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.metadata?.confidence && (
                    <div className="mt-2 pt-1 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                      <span>Độ tin cậy: {Math.round(msg.metadata.confidence * 100)}%</span>
                      <span className="text-sky-700 font-medium">Đã mô phỏng gửi</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          if (isAgent) {
            return (
              <div key={msg.id} className="flex flex-col items-end max-w-xl ml-auto animate-message">
                <div className="bg-[#0284C7] text-white p-3.5 rounded-2xl rounded-tr-sm shadow-sm text-xs leading-relaxed max-w-full">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 pr-1 text-[10px] text-stone-400">
                  <span>{msg.createdAt}</span>
                  {msg.status === 'mock_simulated' ? (
                    <span className="text-amber-600 font-medium">(Mô phỏng gửi)</span>
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-sky-600" />
                  )}
                </div>
              </div>
            );
          }

          // Customer message
          return (
            <div key={msg.id} className="flex flex-col items-start max-w-xl animate-message">
              <span className="text-[11px] font-semibold text-stone-600 mb-1 pl-1">
                {msg.senderName}
              </span>
              <div className="bg-white text-stone-800 border border-stone-200 p-3.5 rounded-2xl rounded-tl-sm shadow-sm text-xs leading-relaxed">
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
              <span className="text-[10px] text-stone-400 mt-1 pl-1">{msg.createdAt}</span>
            </div>
          );
        })}

        {/* AI Suggestion Box when triggered */}
        {aiSuggestion && (
          <div className="bg-white border-2 border-sky-500/80 rounded-2xl p-4 shadow-md animate-message max-w-xl mx-auto my-3">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0284C7]">
                <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
                <span>AI Subagent Đề Xuất Câu Trả Lời</span>
              </div>
              <span className="text-[10px] font-medium bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">
                Độ chính xác: {Math.round(aiSuggestion.confidence * 100)}%
              </span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed bg-[#F0F6FA] p-3 rounded-xl border border-stone-200 mb-2 whitespace-pre-wrap">
              {aiSuggestion.suggestion}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-stone-400 italic">
                Nguồn: {aiSuggestion.source}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInputText(aiSuggestion.suggestion)}
                  className="px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors font-medium"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => {
                    if (onApproveAiSuggestion) {
                      onApproveAiSuggestion(aiSuggestion.suggestion);
                    } else {
                      onSendMessage(aiSuggestion.suggestion, false);
                    }
                  }}
                  className="px-3 py-1 text-xs text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors font-semibold flex items-center gap-1 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Duyệt & Gửi
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Area matching reference */}
      <div className="p-4 bg-white border-t border-[#DCE6EF] flex-shrink-0">
        <div
          className={`border rounded-2xl p-2.5 transition-all bg-white shadow-sm ${
            isInternalNote
              ? 'border-amber-400 bg-amber-50/30'
              : 'border-[#0284C7]/40 focus-within:border-[#0284C7] focus-within:ring-2 focus-within:ring-[#0284C7]/10'
          }`}
        >
          {isInternalNote && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 px-2 py-1 mb-1 bg-amber-100/70 rounded-lg w-fit">
              <FileText className="w-3.5 h-3.5" />
              <span>Đang ở chế độ Ghi chú nội bộ (Khách không thấy)</span>
            </div>
          )}

          {/* Text Area */}
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isInternalNote
                ? 'Nhập ghi chú cho đồng đội...'
                : 'Nhập tin nhắn... (Enter để gửi, Shift+Enter xuống dòng)'
            }
            className="w-full resize-none border-0 bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-0 leading-relaxed px-1"
          />

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-1">
            {/* Left AI / Note Helpers */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={onAiSuggest}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>AI gợi ý</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateConversation({ aiAutoReply: true });
                  onAiSuggest();
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl text-[#0284C7] bg-[#0284C7]/5 hover:bg-[#0284C7]/10 border border-[#0284C7]/20 transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Để AI trả lời</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInternalNote(!isInternalNote)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  isInternalNote
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Ghi chú</span>
              </button>
            </div>

            {/* Right Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() || isSending}
              className={`px-5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                inputText.trim()
                  ? isInternalNote
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-[#0284C7] text-white hover:bg-[#0369A1]'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>{isInternalNote ? 'Lưu ghi chú' : 'Gửi'}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
