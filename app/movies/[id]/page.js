import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function MovieDetail({ params }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/movies/${params.id}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const movie = await res.json();

  return (
    <div className="relative w-full pb-16">
      
      {/* පසුබිම */}
      <div className="absolute top-0 inset-x-0 z-0 h-[50vh] md:h-[60vh] overflow-hidden -mt-16 md:-mt-20">
        <img 
          src={movie.backdrop || movie.poster} 
          alt="Backdrop"
          className="w-full h-full object-cover object-top blur-xl opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-[#05060a]/80 to-transparent"></div>
      </div>

      {/* ප්‍රධාන විස්තර */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-24">
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start bg-black/20 p-4 md:p-8 rounded-3xl backdrop-blur-sm border border-white/5 shadow-2xl">
          
          <div className="w-[180px] md:w-[240px] flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-white/10 group">
            {movie.poster ? (
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="aspect-[2/3] bg-black/50 flex items-center justify-center text-muted">No Poster</div>
            )}
          </div>

          <div className="space-y-3 md:space-y-4 flex-1 text-center md:text-left">
            
            <h1 className="text-lg md:text-2xl font-bold text-white drop-shadow-md leading-tight">
              {movie.title} <span className="text-xs md:text-base text-gray-400 font-normal ml-1">({movie.year})</span>
            </h1>
            
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm font-medium">
              <span className="flex items-center gap-1 text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                ⭐ {movie.rating || 'N/A'}
              </span>
              {movie.duration && (
                <span className="text-gray-300 bg-white/5 px-2 py-0.5 rounded-md">
                  {movie.duration}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
              {(movie.genres || '').split(',').filter(Boolean).map((g, i) => (
                <span key={i} className="text-[10px] md:text-xs bg-white/10 border border-white/10 text-gray-200 px-2 py-0.5 rounded-full">
                  {g.trim()}
                </span>
              ))}
            </div>

            <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-3xl mx-auto md:mx-0 drop-shadow-sm">
              {movie.description}
            </p>
            
            <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
  
              {/* 720p ලින්ක් එක තියෙනවා නම් විතරක් මේක පේනවා */}
              {movie.torrent720p && (
                <Link 
                  href={`/watch/loading?target=${encodeURIComponent(`/watch/movie/${movie.id}?quality=720p`)}&title=${encodeURIComponent(movie.title)}`} 
                  target="_blank" // 👈 මේක අලුත් ටැබ් එකක ඕපන් වෙන්න
                  rel="noopener noreferrer" // 👈 Security එකට
                  className="inline-flex items-center gap-2 bg-accent hover:bg-blue-600 text-white font-semibold px-5 py-2 md:px-6 md:py-2.5 rounded-lg transition-all shadow-lg shadow-accent/30 hover:scale-105 text-xs md:text-sm"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                  Watch 720p
                </Link>
              )}

              {/* 1080p ලින්ක් එක තියෙනවා නම් විතරක් මේක පේනවා */}
              {movie.torrent1080p && (
                <Link 
                  href={`/watch/loading?target=${encodeURIComponent(`/watch/movie/${movie.id}?quality=1080p`)}&title=${encodeURIComponent(movie.title)}`} 
                  target="_blank" // 👈 මේක අලුත් ටැබ් එකක ඕපන් වෙන්න
                  rel="noopener noreferrer" // 👈 Security එකට
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2 md:px-6 md:py-2.5 rounded-lg transition-all shadow-lg hover:scale-105 text-xs md:text-sm"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                  Watch 1080p
                </Link>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}