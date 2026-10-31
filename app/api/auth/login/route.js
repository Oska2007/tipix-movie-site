import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins } from '@/lib/schema';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Drizzle වලින් Admin ව හොයනවා
    const admin = db.select().from(admins).where(eq(admins.email, email)).get();

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ id: admin.id, email: admin.email });
    const res = NextResponse.json({ ok: true });
    
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}