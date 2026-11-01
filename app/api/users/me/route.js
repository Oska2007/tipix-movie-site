import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const token = cookies().get('user_token')?.value;
  if (!token) return NextResponse.json({ user: null });
  
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ user: null });
  
  return NextResponse.json({ user });
}