import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { watchlist } from '@/lib/schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { randomUUID } from 'crypto';
import { eq, and } from 'drizzle-orm';

// 1. ලිස්ට් එක ගන්න (GET)
export async function GET(req) {
  const token = cookies().get('user_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = db.select().from(watchlist).where(eq(watchlist.userId, user.id)).all();
  return NextResponse.json(items);
}

// 2. අලුතින් එකතු කරන්න (POST)
export async function POST(req) {
  const token = cookies().get('user_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { itemId, itemType } = await req.json();

  // දැනටමත් තියෙනවද බලනවා
  const existing = db.select().from(watchlist)
    .where(and(eq(watchlist.userId, user.id), eq(watchlist.itemId, itemId)))
    .get();

  if (existing) return NextResponse.json({ ok: true, message: 'Already in watchlist' });

  db.insert(watchlist).values({
    id: randomUUID(),
    userId: user.id,
    itemId,
    itemType,
    createdAt: Date.now(),
  }).run();

  return NextResponse.json({ ok: true });
}

// 3. අයින් කරන්න (DELETE)
export async function DELETE(req) {
  const token = cookies().get('user_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('itemId');

  db.delete(watchlist)
    .where(and(eq(watchlist.userId, user.id), eq(watchlist.itemId, itemId)))
    .run();

  return NextResponse.json({ ok: true });
}