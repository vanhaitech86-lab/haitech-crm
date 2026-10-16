import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const contactId = params.id;
  const contact = crmStore.getContact(contactId);

  if (!contact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  const deals = crmStore.getDeals().filter((d) => d.contactId === contactId);
  const tasks = crmStore.getTasks().filter((t) => t.contactId === contactId);

  const timeline = [
    {
      id: 'tl-1',
      type: 'ai_event',
      title: 'AI Subagent trích xuất thông tin',
      description: 'Đã nhận diện nhu cầu và thêm vào AI Ghi nhớ về khách.',
      actorName: 'HAITECH Subagent',
      createdAt: '10:52 16/10/2026',
    },
    {
      id: 'tl-2',
      type: 'conversation',
      title: 'Hội thoại qua Zalo cá nhân',
      description: 'Trao đổi về tiêu chuẩn QCVN 6-1:2010/BYT và gửi mẫu thử nghiệm.',
      actorName: 'HAITECH AI',
      createdAt: '10:50 16/10/2026',
    },
    {
      id: 'tl-3',
      type: 'deal_created',
      title: 'Tạo cơ hội: Hợp đồng 50 bộ lọc tổng',
      description: 'Giá trị dự kiến: 145.000.000 đ',
      actorName: 'HAITECH AI',
      createdAt: '08:30 16/10/2026',
    },
    {
      id: 'tl-4',
      type: 'contact',
      title: 'Tạo hồ sơ khách hàng mới',
      description: 'Nguồn tiếp nhận từ kênh Zalo cá nhân · HAITECH AI',
      actorName: 'Hệ thống tự động',
      createdAt: '08:00 16/10/2026',
    },
  ];

  return NextResponse.json({
    contact,
    deals,
    tasks,
    timeline,
  });
}
