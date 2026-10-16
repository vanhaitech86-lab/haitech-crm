import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';
import { getChannelAdapter } from '@/lib/adapters/channels';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id;
  const messages = crmStore.getMessages(conversationId);
  const conversation = crmStore.getConversation(conversationId);

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Clear unread count when reading
  if (conversation.unreadCount > 0) {
    crmStore.updateConversation(conversationId, { unreadCount: 0 });
  }

  return NextResponse.json({
    data: messages,
    conversation,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id;
  const body = await request.json();
  const { text, isInternalNote, senderType } = body;

  if (!text || !text.trim()) {
    return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
  }

  const conversation = crmStore.getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // If not internal note, call adapter (which determines real vs mock)
  let status: 'sent' | 'mock_simulated' = 'sent';
  if (!isInternalNote) {
    const adapter = getChannelAdapter(conversation.channel);
    const result = await adapter.sendMessage({
      recipientId: conversation.customerId,
      text,
    });
    status = result.isMock ? 'mock_simulated' : 'sent';
  }

  const newMsg = crmStore.sendMessage(conversationId, {
    text,
    isInternalNote: Boolean(isInternalNote),
    senderType: senderType || 'agent',
    status,
  });

  return NextResponse.json({ data: newMsg, status });
}
