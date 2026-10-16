import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET() {
  const logs = crmStore.getAuditLogs();
  return NextResponse.json({ data: logs });
}
