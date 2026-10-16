import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function POST() {
  crmStore.resetSeedData();
  return NextResponse.json({
    success: true,
    message: 'Dữ liệu mẫu HAITECH CRM đã được khôi phục về trạng thái ban đầu!',
  });
}
