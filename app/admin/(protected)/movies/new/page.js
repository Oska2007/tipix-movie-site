'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMovie() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    title: '', 
    poster: '', 
    backdrop: '', 
    year: '', 
    rating: '', 
    duration: '', 
    genres: '', 
    language: 'English', // 👈 Language එකතු කළා
    torrent720p: '', 
    torrent1080p: '',
    description: '' 
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
        genres: form.genres.split(',').map(s => s.trim()).filter(Boolean) 
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
      
      <form onSubmit={save} className="bg-panel p-6 rounded-xl space-y-4 border border-white/10">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input-dark" placeholder="Title (Required)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <input className="input-dark" placeholder="Year (e.g. 2024)" type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
          
          <input className="input-dark" placeholder="Poster URL (Vertical Image)" value={form.poster} onChange={e => setForm({...form, poster: e.target.value})} />
          <input className="input-dark" placeholder="Backdrop URL (Landscape Image)" value={form.backdrop} onChange={e => setForm({...form, backdrop: e.target.value})} />
          
          <input className="input-dark" placeholder="Rating (e.g. 8.5)" type="number" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} />
          <input className="input-dark" placeholder="Duration (e.g. 2h 15m)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
          
          <input className="input-dark" placeholder="Genres (Action, Drama)" value={form.genres} onChange={e => setForm({...form, genres: e.target.value})} />
          {/* 👇 අලුත් Language Input එක */}
          <input className="input-dark" placeholder="Language (e.g. English)" value={form.language} onChange={e => setForm({...form, language: e.target.value})} />
        </div>
        
          <input className="input-dark font-mono text-xs" placeholder="720p Magnet Link (Optional)" value={form.torrent720p} onChange={e => setForm({...form, torrent720p: e.target.value})} />
          <input className="input-dark font-mono text-xs" placeholder="1080p Magnet Link (Optional)" value={form.torrent1080p} onChange={e => setForm({...form, torrent1080p: e.target.value})} />
        <textarea className="input-dark h-32" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Movie'}
        </button>
      </form>
    </div>
  );
}