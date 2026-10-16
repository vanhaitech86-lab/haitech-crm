import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';
import { getChannelAdapter } from '@/lib/adapters/channels';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const connectorId = params.id;
  const connectors = crmStore.getConnectors();
  const connector = connectors.find((c) => c.id === connectorId);

  if (!connector) {
    return NextResponse.json({ error: 'Connector not found' }, { status: 404 });
  }

  const adapter = getChannelAdapter(connector.type);
  const isConfigured = adapter.isConfigured();

  // If mock or not configured
  if (!isConfigured) {
    crmStore.addAuditLog({
      action: 'Thử nghiệm gửi tin test (Mock Demo)',
      category: 'connector',
      targetType: 'channel',
      targetId: connector.id,
      targetName: connector.name,
      status: 'warning',
      details: `Kênh đang chạy chế độ Mô phỏng (Demo). Tin nhắn thử nghiệm gửi thành công trong sandbox nội bộ.`,
    });

    return NextResponse.json({
      success: true,
      mode: 'mock',
      message: `Đã gửi sự kiện thử nghiệm thành công (Mô phỏng Sandbox cho ${connector.name}).`,
      timestamp: new Date().toISOString(),
    });
  }

  // Attempt real test
  const testRes = await adapter.sendMessage({
    recipientId: 'test-recipient',
    text: '[HAITECH CRM Test] Xin chào! Đây là tin nhắn kiểm tra kết nối từ hệ thống.',
  });

  return NextResponse.json({
    success: testRes.success,
    mode: 'production',
    message: testRes.success
      ? `Kết nối API ${connector.name} thành công tuyệt đối!`
      : `Lỗi kết nối: ${testRes.error}`,
    timestamp: testRes.timestamp,
  });
}
