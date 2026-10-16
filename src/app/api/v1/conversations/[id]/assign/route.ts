import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id;
  const body = await request.json();
  const { assigneeId, assigneeName, teamId, teamName } = body;

  const updated = crmStore.updateConversation(conversationId, {
    assigneeId,
    assigneeName,
    teamId,
    teamName,
  });

  if (!updated) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  crmStore.addAuditLog({
    action: 'Điều phối / Gán người phụ trách',
    category: 'conversation',
    targetType: 'conversation',
    targetId: conversationId,
    targetName: updated.customerName,
    status: 'success',
    details: `Đã gán cho chuyên viên: ${assigneeName || 'Tự động'}, Đội ngũ: ${teamName || 'Mặc định'}`,
  });

  return NextResponse.json({ data: updated });
}
