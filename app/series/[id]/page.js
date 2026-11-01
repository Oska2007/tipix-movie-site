import Link from 'next/link';
import { notFound } from 'next/navigation';
import WatchlistButton from '@/components/WatchlistButton';

// 👇 Import වලට පස්සේ තමයි මේක එන්න ඕනේ
export async function generateMetadata({ params }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/series/${params.id}`, { cache: 'no-store' });
  if (!res.ok) return { title: 'Series Not Found' };
  const data = await res.json();

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.poster || '/logo.png'],
    },
  };
}

export default async function SeriesDetail({ params }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/series/${params.id}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const data = await res.json();

  return (
    <div className="relative w-full pb-16">
      
      {/* පසුබිම */}
      <div className="absolute top-0 inset-x-0 z-0 h-[50vh] md:h-[60vh] overflow-hidden -mt-16 md:-mt-20">
        <img 
          src={data.backdrop || data.poster} 
          alt="Backdrop"
          className="w-full h-full object-cover object-top blur-xl opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-[#05060a]/80 to-transparent"></div>
      </div>

      {/* ප්‍රධාන විස්තර */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-24">
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start bg-black/20 p-4 md:p-8 rounded-3xl backdrop-blur-sm border border-white/5 shadow-2xl">
          
          <div className="w-[180px] md:w-[240px] flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-white/10 group">
            {data.poster ? (
              <img src={data.poster} alt={data.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="aspect-[2/3] bg-black/50 flex items-center justify-center text-muted">No Poster</div>
            )}
          </div>

          <div className="space-y-3 md:space-y-4 flex-1 text-center md:text-left">
            <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-md leading-tight">
              {data.title} <span className="text-xs md:text-base text-gray-400 font-normal ml-1">({data.year})</span>
            </h1>
            
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm font-medium">
              <span className="flex items-center gap-1 text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                ⭐ {data.rating || 'N/A'}
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
              {(data.genres || '').split(',').filter(Boolean).map((g, i) => (
                <span key={i} className="text-[10px] md:text-xs bg-white/10 border border-white/10 text-gray-200 px-2 py-0.5 rounded-full">
                  {g.trim()}
                </span>
              ))}
            </div>

            <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-3xl mx-auto md:mx-0 drop-shadow-sm">
              {data.description}
            </p>

            {/* 👇 Watchlist බොත්තම */}
            <div className="pt-2 flex justify-center md:justify-start">
              <WatchlistButton itemId={data.id} itemType="series" />
            </div>

          </div>
        </div>

        {/* Seasons සහ Episodes */}
        <div className="space-y-6 mt-8 md:mt-10">
          {data.seasons?.map(season => (
            <div key={season.id} className="bg-panel/80 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base md:text-xl font-bold text-white">Season {season.seasonNumber}</h2>
                <span className="text-[10px] md:text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">{season.episodes.length} Episodes</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {season.episodes.map(ep => (
                  <Link
                    key={ep.id}
                    href={`/watch/loading?target=${encodeURIComponent(`/watch/episode/${ep.id}`)}&title=${encodeURIComponent(`S${ep.season}E${ep.episode} - ${ep.title || data.title}`)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block bg-black/40 hover:bg-accent/20 border border-white/5 hover:border-accent/50 rounded-lg p-3 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm font-semibold text-white group-hover:text-accent transition-colors">E{ep.episode}</span>
                      {ep.subtitles?.length > 0 && (
                        <span className="text-[9px] md:text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded">CC</span>
                      )}
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-400 truncate mt-1">{ep.title || 'Untitled'}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}