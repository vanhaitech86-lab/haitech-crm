import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET() {
  const connectors = crmStore.getConnectors();
  return NextResponse.json({ data: connectors });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, isDemo, status, config } = body;

  const updated = crmStore.updateConnector(id, {
    isDemo,
    status,
    config,
    credentialsConfigured: Boolean(config?.botToken || config?.apiKey || config?.pageId),
  });

  return NextResponse.json({ data: updated });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const connector = crmStore.addConnector(body);
  return NextResponse.json({ data: connector }, { status: 201 });
}

