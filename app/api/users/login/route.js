import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const user = db.select().from(users).where(eq(users.email, email)).get();

    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    // ලොග් වුනාම අන්තිමට ලොග් වුන වෙලාව අප්ඩේට් කරනවා
    db.update(users).set({ lastLogin: Date.now() }).where(eq(users.id, user.id)).run();

    const token = await signToken({ id: user.id, name: user.name, email: user.email });
    const res = NextResponse.json({ ok: true });
    
    // user_token කියලා අලුත් cookie එකක් හදනවා
    res.cookies.set('user_token', token, {
      httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}