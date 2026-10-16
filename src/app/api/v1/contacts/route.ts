import { NextRequest, NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  let contacts = crmStore.getContacts();

  if (search) {
    contacts = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.phone.includes(search) ||
        c.email.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ data: contacts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, phone, email, company, tags, notes, leadSource } = body;

  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
  }

  const currentUser = crmStore.getCurrentUser();
  const newContact = {
    id: `ct-${Date.now()}`,
    name,
    phone,
    email: email || '',
    company: company || '',
    pipelineStage: 'Mới tiếp cận',
    tags: tags || [],
    notes: notes || '',
    aiMemories: [],
    leadSource: leadSource || 'website',
    ownerId: currentUser.id,
    ownerName: currentUser.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dealsCount: 0,
    totalDealValue: 0,
  };

  crmStore.updateContact(newContact.id, newContact);
  return NextResponse.json({ data: newContact });
}
