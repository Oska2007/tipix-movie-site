import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const existing = db.select().from(users).where(eq(users.email, email)).get();
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 10);

    db.insert(users).values({
      id: randomUUID(),
      name,
      email,
      passwordHash,
      createdAt: Date.now(),
    }).run();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}