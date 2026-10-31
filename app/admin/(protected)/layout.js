import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default async function AdminLayout({ children }) {
  const token = cookies().get('admin_token')?.value;
  const user = token ? await verifyToken(token) : null;
  if (!user) redirect('/admin/login');

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6 max-w-[1600px] mx-auto p-4 md:p-6 min-h-screen">
      
      {/* Sidebar */}
      <aside className="bg-panel rounded-xl p-4 space-y-2 h-fit border border-white/5 shadow-xl">
        
        {/* Admin Logo එක */}
        <div className="mb-6 px-3 pt-2 flex justify-center">
          <Link href="/" className="flex flex-col items-center gap-1 group">
            <img 
              src="/logo.png" 
              alt="Tipix Logo" 
              className="h-14 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <span className="text-[10px] text-accent font-semibold tracking-widest uppercase mt-1">Admin Panel</span>
          </Link>
        </div>

        <Link href="/admin" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">📊 Dashboard</Link>
        <Link href="/admin/movies" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">🎬 Movies</Link>
        <Link href="/admin/series" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">📺 TV Series</Link>
        <Link href="/admin/subtitles" className="block px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">💬 Subtitles</Link>
        
        <div className="pt-4 mt-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}