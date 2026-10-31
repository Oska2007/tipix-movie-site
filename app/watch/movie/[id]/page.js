import TorrentPlayer from '@/components/TorrentPlayer';
import { notFound } from 'next/navigation';

export default async function WatchMovie({ params, searchParams }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${base}/api/movies/${params.id}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  
  const movie = await res.json();
  
  // URL එකෙන් quality එක ගන්නවා. නැත්නම් default 720p ගන්නවා.
  const quality = searchParams.quality || '720p';
  const magnetLink = quality === '1080p' ? movie.torrent1080p : movie.torrent720p;

  if (!magnetLink) {
    return <div className="text-center text-white py-20">This quality is not available.</div>;
  }

  const subsRes = await fetch(`${base}/api/subtitles?targetId=${params.id}`, { cache: 'no-store' });
  const subtitles = await subsRes.json();

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          {movie.title} <span className="text-accent text-sm ml-2 bg-accent/10 px-2 py-1 rounded">{quality}</span>
        </h1>
      </div>
      
      {/* දැන් අපි තෝරාගත්ත quality එකේ ලින්ක් එක Player එකට දෙනවා */}
      <TorrentPlayer magnet={magnetLink} subtitles={subtitles} />
    </div>
  );
}