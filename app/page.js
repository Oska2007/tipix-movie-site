import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import SeriesCard from '@/components/SeriesCard';
import HeroSlider from '@/components/HeroSlider';

async function fetchData(endpoint) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/${endpoint}`, { cache: 'no-store' });
  return res.json();
}

export default async function HomePage() {
  const [movies, series] = await Promise.all([
    fetchData('movies'),
    fetchData('series'),
  ]);

  // 👇 මෙන්න මේක තමයි අලුත් වෙනස්කම. 
  // අපි දැන් movies සහ series දෙකෙන්ම, backdrop එකක් තියෙන පළවෙනි ඒවා 6 විතරක් අරගන්නවා.
  const heroItems = [
    ...movies.filter(m => m.backdrop),
    ...series.filter(s => s.backdrop)
  ].slice(0, 6); // 👈 මෙතන .slice(0, 6) දාලා තියෙන්නේ පළවෙනි 6 විතරක් ගන්න

  return (
    <div className="w-full">
      
      {/* අලුත් Auto Slider එක */}
      <HeroSlider items={heroItems} />

      {/* 2. CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-10">
        
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">Latest Movies</h2>
            <Link href="/movies" className="text-xs md:text-sm text-accent hover:underline font-medium">View All</Link>
          </div>
          <div className="flex gap-3 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {/* මෙතන .slice(0, 6) දාලා තියෙන්නේ පළවෙනි 6 විතරක් පෙන්නන්න */}
            {movies.slice(0, 6).map(m => (
              <div key={m.id} className="w-[130px] md:w-[170px] flex-shrink-0">
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">Latest TV Series</h2>
            <Link href="/series" className="text-xs md:text-sm text-accent hover:underline font-medium">View All</Link>
          </div>
          <div className="flex gap-3 md:gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {series.slice(0, 6).map(s => (
              <div key={s.id} className="w-[130px] md:w-[170px] flex-shrink-0">
                <SeriesCard series={s} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}