import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { movies, subtitles } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const movie = db.select().from(movies).where(eq(movies.id, params.id)).get();
    if (!movie) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    
    // Drizzle සඳහා දත්ත හරියට හදාගන්නවා
    const updated = { 
      ...body, 
      genres: Array.isArray(body.genres) ? body.genres.join(', ') : body.genres,
      year: body.year ? Number(body.year) : null,
      rating: body.rating ? Number(body.rating) : null,
    };
    
    // ID එක වෙනස් වෙන්න බෑ
    delete updated.id;
    delete updated.createdAt;

    db.update(movies).set(updated).where(eq(movies.id, params.id)).run();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    // Movie එකට අදාළ සබ්ටයිටල්ස් ටිකත් මකන්න ඕනේ
    db.delete(subtitles).where(and(eq(subtitles.targetType, 'movie'), eq(subtitles.targetId, params.id))).run();
    // ඊට පස්සේ Movie එක මකනවා
    db.delete(movies).where(eq(movies.id, params.id)).run();
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}