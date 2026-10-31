'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');

  async function load() {
    // 👇 cache: 'no-store' දැම්මම අලුත්ම දත්ත එනවා
    const res = await fetch('/api/movies', { cache: 'no-store' });
    setMovies(await res.json());
  }
  
  useEffect(() => { load(); }, []);

  async function del(id) {
    if (!confirm('Delete this movie?')) return;
    await fetch(`/api/movies/${id}`, { method:'DELETE' });
    load();
  }

  const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-white">🎬 Manage Movies</h1>
        <Link href="/admin/movies/new" className="btn-primary text-sm">+ Add Movie</Link>
      </div>

      <input 
        type="text" 
        placeholder="Search movies by title..." 
        className="input-dark w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-2">
        {filteredMovies.map(m => (
          // 👇 මෙතන m._id වෙනුවට m.id දැම්මා
          <div key={m.id} className="bg-panel p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center border border-white/5 gap-4">
            <div>
              <span className="font-bold text-lg text-white">{m.title} {m.year && `(${m.year})`}</span>
              {/* 👇 මෙතනත් m.id දැම්මා */}
              <p className="text-xs text-muted font-mono mt-1">ID: {m.id}</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {/* 👇 Edit ලින්ක් එකේ m.id දැම්මා */}
              <Link href={`/admin/movies/edit/${m.id}`} className="btn-ghost text-sm py-1.5 px-4 flex-1 md:flex-none">Edit</Link>
              {/* 👇 Delete ෆන්ක්ෂන් එකට m.id දැම්මා */}
              <button onClick={() => del(m.id)} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm py-1.5 px-4 rounded-lg transition flex-1 md:flex-none">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}