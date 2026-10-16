import React from 'react';
import { ChannelType } from '@/types/crm';
import { Globe, MessageSquare, Send, Instagram, Music, MessageCircle, Mail, Webhook } from 'lucide-react';

interface ChannelBadgeProps {
  type: ChannelType;
  accountName?: string;
  className?: string;
  showIconOnly?: boolean;
}

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({
  type,
  accountName,
  className = '',
  showIconOnly = false,
}) => {
  const getChannelConfig = () => {
    switch (type) {
      case 'website':
        return {
          label: 'Chat website',
          icon: <Globe className="w-3.5 h-3.5 text-blue-600" />,
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'facebook':
        return {
          label: 'Facebook Messenger',
          icon: <MessageSquare className="w-3.5 h-3.5 text-blue-500" />,
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'instagram':
        return {
          label: 'Instagram',
          icon: <Instagram className="w-3.5 h-3.5 text-pink-600" />,
          bg: 'bg-pink-50 text-pink-700 border-pink-200',
        };
      case 'telegram':
        return {
          label: 'Telegram',
          icon: <Send className="w-3.5 h-3.5 text-sky-500" />,
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'tiktok':
        return {
          label: 'TikTok',
          icon: <Music className="w-3.5 h-3.5 text-stone-900" />,
          bg: 'bg-stone-100 text-stone-800 border-stone-200',
        };
      case 'zalo_personal':
        return {
          label: 'Zalo cá nhân',
          icon: <MessageCircle className="w-3.5 h-3.5 text-blue-600" />,
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'zalo_oa':
        return {
          label: 'Zalo OA',
          icon: <MessageCircle className="w-3.5 h-3.5 text-teal-600" />,
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
        };
      case 'email':
        return {
          label: 'Email',
          icon: <Mail className="w-3.5 h-3.5 text-amber-600" />,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      default:
        return {
          label: 'Webhook',
          icon: <Webhook className="w-3.5 h-3.5 text-purple-600" />,
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
        };
    }
  };

  const config = getChannelConfig();

  if (showIconOnly) {
    return (
      <span className={`inline-flex items-center justify-center p-1 rounded-full border ${config.bg} ${className}`}>
        {config.icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      {config.icon}
      <span>{accountName ? `${config.label} · ${accountName}` : config.label}</span>
    </span>
  );
};
