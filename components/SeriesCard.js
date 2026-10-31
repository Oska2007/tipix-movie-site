import Link from 'next/link';

export default function SeriesCard({ series }) {
  return (
    // 👇 මෙතන series._id වෙනුවට series.id දැම්මා
    <Link href={`/series/${series.id}`} className="group block rounded-xl overflow-hidden bg-panel border border-white/5 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-accent/20">
      <div className="aspect-[2/3] bg-black/40 overflow-hidden">
        {series.poster ? (
          <img src={series.poster} alt={series.title} className="w-full h-full object-cover transition-opacity group-hover:opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">No Poster</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate text-white">{series.title}</h3>
        <p className="text-xs text-muted mt-1">{series.year} • ⭐ {series.rating || 'N/A'}</p>
      </div>
    </Link>
  );
}