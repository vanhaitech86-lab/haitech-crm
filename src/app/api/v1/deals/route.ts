import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET() {
  const deals = crmStore.getDeals();
  const stages = crmStore.getPipelineStages();
  return NextResponse.json({ data: deals, stages });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, value, stageId, contactId, contactName, expectedCloseDate, notes, channelSource } = body;

  if (!title || !contactId) {
    return NextResponse.json({ error: 'Title and contactId are required' }, { status: 400 });
  }

  const currentUser = crmStore.getCurrentUser();

  const newDeal = crmStore.createDeal({
    title,
    value: Number(value) || 0,
    stageId: stageId || 'stage-lead',
    contactId,
    contactName: contactName || 'Khách hàng',
    expectedCloseDate: expectedCloseDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    ownerId: currentUser.id,
    ownerName: currentUser.name,
    channelSource: channelSource || 'website',
    notes,
  });

  return NextResponse.json({ data: newDeal });
}
