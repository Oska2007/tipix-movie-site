import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { movies } from '@/lib/schema';
import { and, eq, like, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '0');
  const search = searchParams.get('search') || '';
  const year = searchParams.get('year') || '';
  const genre = searchParams.get('genre') || '';
  const language = searchParams.get('language') || '';

  let conditions = [];
  if (search) conditions.push(like(movies.title, `%${search}%`));
  if (year) conditions.push(eq(movies.year, parseInt(year)));
  if (genre) conditions.push(like(movies.genres, `%${genre}%`)); // Genres comma separated string එකක් නිසා
  if (language) conditions.push(eq(movies.language, language));

  let query = db.select().from(movies);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  let results = query.orderBy(desc(movies.createdAt));
  
  if (limit > 0) {
    results = results.limit(limit);
  }
  
  return NextResponse.json(results.all());
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    const newMovie = {
      id: randomUUID(),
      ...body,
      genres: Array.isArray(body.genres) ? body.genres.join(', ') : body.genres,
      year: body.year ? Number(body.year) : null,
      rating: body.rating ? Number(body.rating) : null,
      createdAt: Date.now()
    };
    
    db.insert(movies).values(newMovie).run();
    return NextResponse.json(newMovie);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}