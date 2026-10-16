import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET() {
  const tasks = crmStore.getTasks();
  return NextResponse.json({ data: tasks });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, dueDate, priority, contactId, contactName, dealId, dealTitle } = body;

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const currentUser = crmStore.getCurrentUser();
  const newTask = crmStore.createTask({
    title,
    description: description || '',
    dueDate: dueDate || 'Hôm nay',
    priority: priority || 'medium',
    status: 'pending',
    assigneeId: currentUser.id,
    assigneeName: currentUser.name,
    contactId,
    contactName,
    dealId,
    dealTitle,
  });

  return NextResponse.json({ data: newTask });
}
