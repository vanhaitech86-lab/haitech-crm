import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const dealId = params.id;
  const body = await request.json();
  const { stageId } = body;

  if (!stageId) {
    return NextResponse.json({ error: 'stageId is required' }, { status: 400 });
  }

  const updatedDeal = crmStore.updateDealStage(dealId, stageId);
  if (!updatedDeal) {
    return NextResponse.json({ error: 'Deal or Stage not found' }, { status: 404 });
  }

  return NextResponse.json({ data: updatedDeal });
}
