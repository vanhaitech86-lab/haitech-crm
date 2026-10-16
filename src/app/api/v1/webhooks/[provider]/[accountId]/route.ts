import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';
import { ChannelType } from '@/types/crm';
import { getChannelAdapter } from '@/lib/adapters/channels';

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string; accountId: string } }
) {
  const provider = params.provider as ChannelType;
  const accountId = params.accountId;
  const body = await request.json();

  // Idempotency check / verification
  const adapter = getChannelAdapter(provider);
  const isValid = adapter.verifyWebhook({}, body);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  const { customerId, customerName, text } = await adapter.handleInboundWebhook(body);

  // Find or create conversation
  const connectors = crmStore.getConnectors();
  const connector = connectors.find((c) => c.type === provider);

  const result = crmStore.simulateInboundWebhook(
    connector?.id || 'conn-website',
    customerName,
    text
  );

  return NextResponse.json({
    success: true,
    data: result,
  });
}
