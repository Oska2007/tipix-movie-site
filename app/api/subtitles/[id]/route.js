import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subtitles } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// SRT to VTT Converter
function srtToVtt(srt) {
  if (!srt) return 'WEBVTT\n\n';
  if (srt.trim().startsWith('WEBVTT')) return srt;
  return 'WEBVTT\n\n' + srt
    .replace(/\r+/g, '')
    .replace(/^\uFEFF/, '')
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
    .trim();
}

export async function GET(req, { params }) {
  try {
    const sub = db.select().from(subtitles).where(eq(subtitles.id, params.id)).get();
    if (!sub) return new NextResponse('Not found', { status: 404 });

    const vtt = srtToVtt(sub.content);
    return new Response(vtt, {
      headers: { 'Content-Type': 'text/vtt; charset=utf-8' },
    });
  } catch (error) {
    return new NextResponse('Error', { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    db.delete(subtitles).where(eq(subtitles.id, params.id)).run();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}