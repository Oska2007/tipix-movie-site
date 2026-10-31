import MovieCard from '@/components/MovieCard';
import FilterBar from '@/components/FilterBar';

export default async function AllMovies({ searchParams }) {
  const query = new URLSearchParams(searchParams).toString();
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const movies = await (await fetch(`${base}/api/movies?${query}`, { cache: 'no-store' })).json();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* අකුරු ප්‍රමාණය text-2xl md:text-3xl */}
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white">All Movies</h1>
      
      <FilterBar type="movies" />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mt-6">
        {/* 👇 මෙතන m._id වෙනුවට m.id දැම්මා */}
        {movies.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
      
      {movies.length === 0 && <p className="text-muted mt-10">No movies found.</p>}
    </div>
  );
}