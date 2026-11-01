import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { watchlist, movies, series } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import MovieCard from '@/components/MovieCard';
import SeriesCard from '@/components/SeriesCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MyList() {
  const token = cookies().get('user_token')?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-white mb-4">Please login to view your list</h1>
        <Link href="/login" className="btn-primary">Go to Login</Link>
      </div>
    );
  }

  const listItems = db.select().from(watchlist).where(eq(watchlist.userId, user.id)).all();
  
  // ලිස්ට් එකේ තියෙන ID වලට අදාළ ෆිල්ම්ස් සහ සීරීස් වෙන් කරගන්නවා
  const movieIds = listItems.filter(i => i.itemType === 'movie').map(i => i.itemId);
  const seriesIds = listItems.filter(i => i.itemType === 'series').map(i => i.itemId);

  // ඒවායේ සම්පූර්ණ විස්තර ඩේටාබේස් එකෙන් ගන්නවා
  const savedMovies = movieIds.length > 0 ? db.select().from(movies).where(require('drizzle-orm').inArray(movies.id, movieIds)).all() : [];
  const savedSeries = seriesIds.length > 0 ? db.select().from(series).where(require('drizzle-orm').inArray(series.id, seriesIds)).all() : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <h1 className="text-2xl md:text-3xl font-bold text-white">My List</h1>

      {savedMovies.length === 0 && savedSeries.length === 0 && (
        <p className="text-muted">Your list is empty. Add some movies and series!</p>
      )}

      {savedMovies.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {savedMovies.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
        </section>
      )}

      {savedSeries.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">TV Series</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {savedSeries.map(s => <SeriesCard key={s.id} series={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}