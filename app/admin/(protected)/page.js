import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-accent">Tipix</span> Admin Dashboard
        </h1>
        <p className="text-muted">Welcome back! Manage your content from here.</p>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Movies Card */}
        <Link href="/admin/movies" className="bg-panel p-6 rounded-xl border border-white/5 hover:border-accent/50 hover:bg-panel/80 transition-all group shadow-lg shadow-black/50">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎬</div>
          <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-2">Movies</h2>
          <p className="text-sm text-muted">Add, edit, or remove movies and manage their subtitles.</p>
        </Link>

        {/* TV Series Card */}
        <Link href="/admin/series" className="bg-panel p-6 rounded-xl border border-white/5 hover:border-accent/50 hover:bg-panel/80 transition-all group shadow-lg shadow-black/50">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📺</div>
          <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-2">TV Series</h2>
          <p className="text-sm text-muted">Manage TV shows, add seasons, and upload episodes.</p>
        </Link>

        {/* Subtitles Card */}
        <Link href="/admin/subtitles" className="bg-panel p-6 rounded-xl border border-white/5 hover:border-accent/50 hover:bg-panel/80 transition-all group shadow-lg shadow-black/50">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💬</div>
          <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-2">Subtitles</h2>
          <p className="text-sm text-muted">Upload and manage SRT subtitles for your content.</p>
        </Link>

      </div>

      {/* Pro Tip Section */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
        <h3 className="text-accent font-bold mb-2 flex items-center gap-2">
          <span>💡</span> Pro Tip
        </h3>
        <p className="text-sm text-muted leading-relaxed">
          Make sure to use <strong>MP4 (H.264)</strong> torrent links or Real-Debrid for the best browser playback experience. 
          MKV and HEVC (x265) formats may not play natively in web browsers.
        </p>
      </div>

    </div>
  );
}