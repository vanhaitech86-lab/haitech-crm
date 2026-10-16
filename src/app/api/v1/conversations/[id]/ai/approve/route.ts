import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id;
  const body = await request.json();
  const { suggestionText, model, confidence } = body;

  const conversation = crmStore.getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const message = crmStore.sendMessage(conversationId, {
    text: suggestionText,
    senderType: 'ai',
    senderName: 'HAITECH Subagent (AI)',
    status: 'mock_simulated',
    metadata: {
      aiModel: model || 'claude-3-7-sonnet',
      confidence: confidence || 0.95,
      approvedBy: crmStore.getCurrentUser().name,
    },
  });

  return NextResponse.json({ data: message, success: true });
}
