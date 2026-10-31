import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seasons, episodes } from '@/lib/schema';
import { randomUUID } from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { seriesId, seasonNumber, torrentMagnet, infoHash, torrentName, episodes: eps } = body;

    if (!seriesId || !seasonNumber || !torrentMagnet || !eps?.length) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // කලින් තියෙන Season එකක් නම් ඒක මකන්න
    const existingSeasons = db.select().from(seasons).where(eq(seasons.seriesId, seriesId)).all();
    existingSeasons.forEach(s => {
        if(s.seasonNumber === seasonNumber){
            db.delete(episodes).where(eq(episodes.seasonId, s.id)).run();
            db.delete(seasons).where(eq(seasons.id, s.id)).run();
        }
    });

    const seasonId = randomUUID();
    
    // Season එක Save කරනවා
    db.insert(seasons).values({
      id: seasonId,
      seriesId,
      seasonNumber,
      torrentMagnet,
      infoHash,
      torrentName,
      totalFiles: eps.length,
      createdAt: Date.now()
    }).run();

    // Episodes ටික Save කරනවා
    eps.forEach(ep => {
      db.insert(episodes).values({
        id: randomUUID(),
        seriesId,
        seasonId,
        season: seasonNumber,
        episode: ep.episode,
        title: ep.title,
        torrentMagnet,
        fileIndex: ep.fileIndex,
        fileName: ep.fileName,
        size: ep.size,
        createdAt: Date.now()
      }).run();
    });

    return NextResponse.json({ ok: true, seasonId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}