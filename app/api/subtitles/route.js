import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subtitles } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

// Subtitle ලබා ගැනීම
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetId = searchParams.get('targetId');
  if (!targetId) return NextResponse.json([]);

  const subs = db.select().from(subtitles).where(eq(subtitles.targetId, targetId)).all();
  return NextResponse.json(subs);
}

// අලුත් Subtitle එකක් Save කිරීම
export async function POST(req) {
  try {
    const body = await req.json();
    const { targetId, targetType, language, label, content } = body;

    if (!targetId || !language || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // එකම භාෂාවට තියෙන පරණ එක මකන්න (Update එකක් වගේ වැඩ කරන්න)
    db.delete(subtitles)
      .where(and(eq(subtitles.targetId, targetId), eq(subtitles.language, language)))
      .run();

    const newSub = {
      id: randomUUID(),
      targetType: targetType || 'movie',
      targetId,
      language,
      label,
      content,
      createdAt: Date.now()
    };

    db.insert(subtitles).values(newSub).run();
    return NextResponse.json(newSub);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}