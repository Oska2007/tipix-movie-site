import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { episodes } from '@/lib/schema';
import { randomUUID } from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { seriesId, seasonId, season, episode, title, torrentMagnet, fileIndex } = body;

    if (!seriesId || !seasonId || !episode || !torrentMagnet) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    db.insert(episodes).values({
      id: randomUUID(),
      seriesId,
      seasonId,
      season: Number(season),
      episode: Number(episode),
      title: title || `Episode ${episode}`,
      torrentMagnet,
      fileIndex: Number(fileIndex) || 0,
      createdAt: Date.now()
    }).run();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}