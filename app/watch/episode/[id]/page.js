import TorrentPlayer from '@/components/TorrentPlayer';
import { notFound } from 'next/navigation';

export default async function WatchEpisode({ params }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/episodes/${params.id}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const ep = await res.json();

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          {ep.seriesId?.title || 'TV Series'} — S{ep.season}E{ep.episode}
          {ep.title && <span className="text-gray-400 text-base ml-2">· {ep.title}</span>}
        </h1>
      </div>

      <TorrentPlayer
        magnet={ep.torrentMagnet}
        fileIndex={ep.fileIndex}
        subtitles={ep.subtitles || []}
      />

      {ep.subtitles?.length > 0 && (
        <p className="text-xs text-muted px-2">
          Available Subtitles: {ep.subtitles.map(s => s.label).join(', ')}
        </p>
      )}
    </div>
  );
}