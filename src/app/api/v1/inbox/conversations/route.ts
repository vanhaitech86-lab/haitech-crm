import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const channel = searchParams.get('channel');
  const search = searchParams.get('search')?.toLowerCase();

  let conversations = crmStore.getConversations();

  if (status && status !== 'all') {
    if (status === 'unread') {
      conversations = conversations.filter((c) => c.unreadCount > 0);
    } else if (status === 'needs_you') {
      conversations = conversations.filter((c) => c.status === 'open' || c.status === 'in_progress');
    } else if (status === 'ai_active') {
      conversations = conversations.filter((c) => c.aiAutoReply);
    } else {
      conversations = conversations.filter((c) => c.status === status);
    }
  }

  if (channel && channel !== 'all') {
    conversations = conversations.filter((c) => c.channel === channel);
  }

  if (search) {
    conversations = conversations.filter(
      (c) =>
        c.customerName.toLowerCase().includes(search) ||
        (c.customerPhone && c.customerPhone.includes(search)) ||
        c.lastMessageSnippet.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    data: conversations,
    total: conversations.length,
    unreadTotal: conversations.filter((c) => c.unreadCount > 0).length,
  });
}
