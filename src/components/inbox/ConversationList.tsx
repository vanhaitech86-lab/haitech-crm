'use client';

import React, { useState } from 'react';
import { Search, Bot, Users as UsersIcon } from 'lucide-react';
import { Conversation, ChannelConnector } from '@/types/crm';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
  channelConnectors: ChannelConnector[];
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  channelConnectors,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'needs_you' | 'ai_active'>('all');

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.customerName.toLowerCase().includes(q);
      const matchPhone = c.customerPhone && c.customerPhone.includes(q);
      const matchSnippet = c.lastMessageSnippet.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchSnippet) return false;
    }

    // Channel filter
    if (selectedChannelFilter !== 'all') {
      if (c.channel !== selectedChannelFilter && c.channelAccountName !== selectedChannelFilter) {
        return false;
      }
    }

    // Tab filter
    if (activeTab === 'unread' && c.unreadCount === 0) return false;
    if (activeTab === 'needs_you' && (c.status === 'closed' || c.aiAutoReply)) return false;
    if (activeTab === 'ai_active' && !c.aiAutoReply) return false;

    return true;
  });

  return (
    <div className="w-[440px] flex-shrink-0 bg-white border-r border-[#DCE6EF] flex flex-col h-full overflow-hidden">
      {/* Top Search Input */}
      <div className="p-3 pb-2 border-b border-stone-100">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên, SĐT, nội dung..."
            className="w-full bg-[#F0F6FA] text-sm text-stone-800 placeholder-stone-400 pl-9 pr-3 py-2 rounded-xl border border-transparent focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-xs text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Channel Filters Scrollable Pill Area matching reference */}
      <div className="px-3 py-2 border-b border-stone-100 flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto text-xs scrollbar-none bg-[#FAFCFB]">
        {/* All Channels Button */}
        <button
          onClick={() => setSelectedChannelFilter('all')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors ${
            selectedChannelFilter === 'all'
              ? 'bg-[#0284C7] text-white font-medium shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span>Tất cả</span>
          <span className={`text-[10px] font-semibold ${selectedChannelFilter === 'all' ? 'text-sky-200' : 'text-stone-400'}`}>
            {conversations.length}
          </span>
        </button>

        {/* Dynamic Connectors Pills */}
        {channelConnectors.map((conn) => {
          const isSelected = selectedChannelFilter === conn.type || selectedChannelFilter === conn.accountName;
          const dotColor =
            conn.type === 'website'
              ? 'bg-amber-500'
              : conn.type === 'facebook'
              ? 'bg-purple-600'
              : conn.type === 'telegram'
              ? 'bg-sky-500'
              : conn.type === 'instagram'
              ? 'bg-pink-500'
              : conn.type === 'tiktok'
              ? 'bg-stone-900'
              : 'bg-blue-600';

          return (
            <button
              key={conn.id}
              onClick={() => setSelectedChannelFilter(conn.type)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-[#0284C7] text-white font-medium shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
              <span>{conn.name}</span>
              {conn.accountName && (
                <span className="text-stone-400 max-w-[80px] truncate">
                  · {conn.accountName}
                </span>
              )}
              <span className={`text-[10px] font-semibold ${isSelected ? 'text-sky-200' : 'text-stone-400'}`}>
                {conn.unreadCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status Tabs matching reference */}
      <div className="flex border-b border-stone-200 px-3 bg-white text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-3 font-medium transition-colors border-b-2 relative ${
            activeTab === 'all'
              ? 'border-[#0284C7] text-[#0284C7] font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`py-2 px-3 font-medium transition-colors border-b-2 ${
            activeTab === 'unread'
              ? 'border-[#0284C7] text-[#0284C7] font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Chưa đọc
        </button>
        <button
          onClick={() => setActiveTab('needs_you')}
          className={`py-2 px-3 font-medium transition-colors border-b-2 ${
            activeTab === 'needs_you'
              ? 'border-[#0284C7] text-[#0284C7] font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Cần bạn
        </button>
        <button
          onClick={() => setActiveTab('ai_active')}
          className={`py-2 px-3 font-medium transition-colors border-b-2 ${
            activeTab === 'ai_active'
              ? 'border-[#0284C7] text-[#0284C7] font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          AI đang trực
        </button>
      </div>

      {/* Conversation List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-xs">
            Không tìm thấy hội thoại phù hợp.
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedConversationId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`p-3 cursor-pointer transition-colors relative flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#E0F2FE] border-l-4 border-l-[#0284C7]'
                    : 'hover:bg-stone-50/80 bg-white'
                }`}
              >
                {/* Left Avatar with Initial */}
                <div className="relative flex-shrink-0">
                  {conv.customerAvatar ? (
                    <img
                      src={conv.customerAvatar}
                      alt={conv.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center border border-sky-200 text-sm">
                      {conv.customerName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {conv.isGroup && (
                    <span className="absolute -bottom-1 -right-1 bg-stone-700 text-white p-0.5 rounded-full ring-2 ring-white">
                      <UsersIcon className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Right Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and Time */}
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-[#0284C7]' : 'text-stone-900'
                      }`}
                    >
                      {conv.customerName}
                    </h4>
                    <span className="text-[10px] text-stone-400 whitespace-nowrap">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  {/* Message Snippet */}
                  <p className="text-[11px] text-stone-600 truncate mb-1.5">
                    {conv.lastMessageSnippet}
                  </p>

                  {/* Badges Row matching reference */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 truncate max-w-[140px]">
                        {conv.channel === 'zalo_personal'
                          ? `Zalo cá nhân · ${conv.assigneeName || 'HAITECH AI'}`
                          : conv.channel === 'facebook'
                          ? `Facebook Messenger · ${conv.channelAccountName}`
                          : conv.channel === 'telegram'
                          ? `Telegram · ${conv.channelAccountName}`
                          : conv.channel === 'website'
                          ? `Website Widget`
                          : conv.channel}
                      </span>

                      {conv.aiAutoReply && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                          <Bot className="w-2.5 h-2.5 text-amber-700" />
                          AI
                        </span>
                      )}

                      {conv.isGroup && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                          Nhóm
                        </span>
                      )}
                    </div>

                    {/* Unread Counter Badge */}
                    {conv.unreadCount > 0 && (
                      <span className="bg-[#0284C7] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
