import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { series } from '@/lib/schema';
import { and, eq, like, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { sendToTelegram } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '0');
  const search = searchParams.get('search') || '';
  const year = searchParams.get('year') || '';
  const genre = searchParams.get('genre') || '';
  const language = searchParams.get('language') || '';

  let conditions = [];
  if (search) conditions.push(like(series.title, `%${search}%`));
  if (year) conditions.push(eq(series.year, parseInt(year)));
  if (genre) conditions.push(like(series.genres, `%${genre}%`));
  if (language) conditions.push(eq(series.language, language));

  let query = db.select().from(series);
  if (conditions.length > 0) query = query.where(and(...conditions));
  
  let results = query.orderBy(desc(series.createdAt));
  if (limit > 0) results = results.limit(limit);
  
  return NextResponse.json(results.all());
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    const newSeries = {
      id: randomUUID(),
      ...body,
      genres: Array.isArray(body.genres) ? body.genres.join(', ') : body.genres,
      year: body.year ? Number(body.year) : null,
      rating: body.rating ? Number(body.rating) : null,
      createdAt: Date.now()
    };
    
    // 1. ඩේටාබේස් එකට සේව් කරනවා
    db.insert(series).values(newSeries).run();

    // 2. ටෙලිග්‍රෑම් එකට යවනවා
    await sendToTelegram({
      title: newSeries.title,
      description: newSeries.description,
      poster: newSeries.poster,
      type: 'series',
      id: newSeries.id
    });

    return NextResponse.json(newSeries);
  } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}