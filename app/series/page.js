import SeriesCard from '@/components/SeriesCard';
import FilterBar from '@/components/FilterBar';

export default async function AllSeries({ searchParams }) {
  const query = new URLSearchParams(searchParams).toString();
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const series = await (await fetch(`${base}/api/series?${query}`, { cache: 'no-store' })).json();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white">All TV Series</h1>
      
      <FilterBar type="series" />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mt-6">
        {/* 👇 මෙතන s._id වෙනුවට s.id දැම්මා */}
        {series.map(s => <SeriesCard key={s.id} series={s} />)}
      </div>
      
      {series.length === 0 && <p className="text-muted mt-10">No series found.</p>}
    </div>
  );
}