'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TMDBImport from '@/components/admin/TMDBImport';

export default function NewMovie() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    title: '', poster: '', backdrop: '', year: '', rating: '', 
    duration: '', genres: '', language: 'English', 
    torrent720p: '', torrent1080p: '', description: '' 
  });
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { 
        ...form, 
        year: form.year ? Number(form.year) : null, 
        rating: form.rating ? Number(form.rating) : null, 
        genres: typeof form.genres === 'string' ? form.genres : form.genres.join(', ')
      };
      
      const res = await fetch('/api/movies', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });
      
      if (res.ok) {
        router.push('/admin/movies');
        router.refresh();
      } else {
        alert("Failed to save movie.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Add New Movie</h1>
      
      {/* 👇 මෙන්න මේක තමයි අලුත් Search Box එක */}
      <TMDBImport 
        type="movie" 
        onImport={(data) => setForm(prev => ({ ...prev, ...data }))} 
      />
      
      <form onSubmit={save} className="bg-panel p-6 rounded-xl space-y-4 border border-white/10">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input-dark" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <input className="input-dark" placeholder="Year" type="number" value={form.year || ''} onChange={e => setForm({...form, year: e.target.value})} />
          
          <input className="input-dark" placeholder="Poster URL" value={form.poster || ''} onChange={e => setForm({...form, poster: e.target.value})} />
          <input className="input-dark" placeholder="Backdrop URL" value={form.backdrop || ''} onChange={e => setForm({...form, backdrop: e.target.value})} />
          
          <input className="input-dark" placeholder="Rating" type="number" step="0.1" value={form.rating || ''} onChange={e => setForm({...form, rating: e.target.value})} />
          <input className="input-dark" placeholder="Duration" value={form.duration || ''} onChange={e => setForm({...form, duration: e.target.value})} />
          
          <input className="input-dark" placeholder="Genres" value={form.genres || ''} onChange={e => setForm({...form, genres: e.target.value})} />
          <input className="input-dark" placeholder="Language" value={form.language || ''} onChange={e => setForm({...form, language: e.target.value})} />
        </div>
        
        <input className="input-dark font-mono text-xs" placeholder="720p Magnet Link" value={form.torrent720p} onChange={e => setForm({...form, torrent720p: e.target.value})} />
        <input className="input-dark font-mono text-xs" placeholder="1080p Magnet Link" value={form.torrent1080p} onChange={e => setForm({...form, torrent1080p: e.target.value})} />
        
        <textarea className="input-dark h-32" placeholder="Description" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
        
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Movie'}
        </button>
      </form>
    </div>
  );
}