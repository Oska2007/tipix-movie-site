import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { series, seasons, episodes, subtitles } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    // 1. Series එක ගන්නවා
    const seriesData = db.select().from(series).where(eq(series.id, params.id)).get();
    if (!seriesData) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // 2. ඒකට අදාළ Seasons ටික ගන්නවා
    const seasonsData = db.select().from(seasons).where(eq(seasons.seriesId, params.id)).orderBy(seasons.seasonNumber).all();

    // 3. හැම Season එකකටම Episodes ටික ගන්නවා
    const seasonsWithEps = seasonsData.map((s) => {
      const eps = db.select().from(episodes).where(eq(episodes.seasonId, s.id)).orderBy(episodes.episode).all();
      
      const epsWithSubs = eps.map((ep) => {
        const subs = db.select({ id: subtitles.id, language: subtitles.language, label: subtitles.label })
          .from(subtitles)
          .where(eq(subtitles.targetId, ep.id))
          .all();
        return { ...ep, subtitles: subs };
      });
      
      return { ...s, episodes: epsWithSubs };
    });

    return NextResponse.json({ ...seriesData, seasons: seasonsWithEps });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = {
      ...body,
      genres: Array.isArray(body.genres) ? body.genres.join(', ') : body.genres,
      year: body.year ? Number(body.year) : null,
      rating: body.rating ? Number(body.rating) : null,
    };
    
    // id එක වෙනස් වෙන්න බෑ
    delete updated.id;
    delete updated.createdAt;

    db.update(series).set(updated).where(eq(series.id, params.id)).run();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    // Series එකට අදාළ හැම දෙයක්ම මකන්න ඕනේ (Cascade Delete)
    const s = db.select().from(seasons).where(eq(seasons.seriesId, params.id)).all();
    s.forEach(season => {
      db.delete(episodes).where(eq(episodes.seasonId, season.id)).run();
      db.delete(seasons).where(eq(seasons.id, season.id)).run();
    });
    db.delete(series).where(eq(series.id, params.id)).run();
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}