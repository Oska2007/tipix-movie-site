import { db } from '@/lib/db';
import { series, seasons, episodes, subtitles } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import SeasonUploader from '@/components/admin/SeasonUploader';
import EpisodeRow from '@/components/admin/EpisodeRow';
import ManualEpisodeAdder from '@/components/admin/ManualEpisodeAdder';

export const dynamic = 'force-dynamic';

async function getData(id) {
  if (typeof id !== 'string') return null;

  const seriesData = db.select().from(series).where(eq(series.id, id)).get();
  if (!seriesData) return null;

  const seasonsData = db.select().from(seasons).where(eq(seasons.seriesId, id)).orderBy(seasons.seasonNumber).all();

  const seasonsWithEps = seasonsData.map((s) => {
    const eps = db.select().from(episodes).where(eq(episodes.seasonId, s.id)).orderBy(episodes.episode).all();
    
    const epsWithSubs = eps.map((ep) => {
      const subs = db.select({ id: subtitles.id, language: subtitles.language, label: subtitles.label })
        .from(subtitles)
        .where(eq(subtitles.targetId, ep.id))
        .all();
      return { ...ep, subtitles: subs };
    });
    
    return { ...s, episodes: epsWithSubs };
  });

  return {
    series: seriesData,
    seasons: seasonsWithEps,
  };
}

export default async function AdminSeriesDetail({ params }) {
  const data = await getData(params.id);
  
  if (!data) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-white mb-4">Series not found</h1>
        <Link href="/admin/series" className="btn-primary">Back to Series</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">📺 {data.series.title}</h1>
        <Link href="/admin/series" className="btn-ghost text-sm">← Back</Link>
      </div>

      <SeasonUploader seriesId={data.series.id} />

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-accent">Seasons</h2>
        {data.seasons.length === 0 && <p className="text-muted text-sm">No seasons yet. Parse a torrent above.</p>}
        
        {data.seasons.map(season => (
          <div key={season.id} className="bg-panel rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-white">Season {season.seasonNumber}</h3>
              <span className="text-xs text-muted bg-black/40 px-2 py-1 rounded-md">
                {season.episodes.length} Episodes • {season.torrentName || 'Torrent'}
              </span>
            </div>
            
            <div className="space-y-2">
              {season.episodes.map(ep => (
                <EpisodeRow key={ep.id} episode={ep} />
              ))}
            </div>

            {/* මෙන්න මේ තැන තමයි Manual Episode Adder එක දාලා තියෙන්නේ */}
            <ManualEpisodeAdder 
              seriesId={data.series.id} 
              seasonId={season.id} 
              seasonNumber={season.seasonNumber} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}