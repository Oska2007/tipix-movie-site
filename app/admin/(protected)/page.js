import Link from 'next/link';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import LiveUsersWidget from '@/components/admin/LiveUsersWidget'; // 👈 අලුත් කොටස

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // ඩේටාබේස් එකෙන් මුළු යූසර්ස්ලා ගණන ගන්නවා
  const allUsers = db.select().from(users).all();
  const totalUsers = allUsers.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-accent">Tipix</span> Admin Dashboard
        </h1>
        <p className="text-muted">Welcome back! Manage your content from here.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-panel p-6 rounded-xl border border-white/5 shadow-lg">
          <p className="text-sm text-muted mb-1 flex items-center gap-2">
            <span>👥</span> Total Registered Users
          </p>
          <h2 className="text-4xl font-bold text-white">{totalUsers}</h2>
        </div>
        
        {/* 👇 අපි මේක වෙනම කොම්පෝනන්ට් එකකට දැම්මා */}
        <LiveUsersWidget />
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/movies" className="bg-panel p-6 rounded-xl border border-white/5 hover:border-accent/50 hover:bg-panel/80 transition-all group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎬</div>
          <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-2">Movies</h2>
          <p className="text-sm text-muted">Add, edit, or remove movies.</p>
        </Link>
        <Link href="/admin/series" className="bg-panel p-6 rounded-xl border border-white/5 hover:border-accent/50 hover:bg-panel/80 transition-all group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📺</div>
          <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-2">TV Series</h2>
          <p className="text-sm text-muted">Manage TV shows and episodes.</p>
        </Link>
        <Link href="/admin/subtitles" className="bg-panel p-6 rounded-xl border border-white/5 hover:border-accent/50 hover:bg-panel/80 transition-all group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💬</div>
          <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-2">Subtitles</h2>
          <p className="text-sm text-muted">Manage SRT subtitles.</p>
        </Link>
      </div>
    </div>
  );
}