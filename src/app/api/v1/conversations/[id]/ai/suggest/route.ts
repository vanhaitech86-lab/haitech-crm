import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id;
  const conversation = crmStore.getConversation(conversationId);

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const suggestion = crmStore.generateAiSuggestion(conversationId);

  return NextResponse.json({
    data: suggestion,
    hasApiKey: Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY),
  });
}
