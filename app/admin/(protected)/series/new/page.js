'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSeries() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    title: '', 
    poster: '', 
    backdrop: '', 
    year: '', 
    rating: '', 
    genres: '', 
    language: 'English', // 👈 Language එකතු කළා
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
      
      const res = await fetch('/api/series', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });
      
      if (res.ok) {
        router.push('/admin/series');
        router.refresh();
      } else {
        alert("Failed to save series.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Add New TV Series</h1>
      
      <form onSubmit={save} className="bg-panel p-6 rounded-xl space-y-4 border border-white/10">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input-dark" placeholder="Title (Required)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <input className="input-dark" placeholder="Year (e.g. 2024)" type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
          
          <input className="input-dark" placeholder="Poster URL (Vertical)" value={form.poster} onChange={e => setForm({...form, poster: e.target.value})} />
          <input className="input-dark" placeholder="Backdrop URL (Landscape)" value={form.backdrop} onChange={e => setForm({...form, backdrop: e.target.value})} />
          
          <input className="input-dark" placeholder="Rating (e.g. 8.5)" type="number" step="0.1" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} />
          <input className="input-dark" placeholder="Genres (Action, Drama)" value={form.genres} onChange={e => setForm({...form, genres: e.target.value})} />
          
          <input className="input-dark md:col-span-2" placeholder="Language (e.g. English)" value={form.language} onChange={e => setForm({...form, language: e.target.value})} />
        </div>
        
        <textarea className="input-dark h-32" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Series'}
        </button>
      </form>
    </div>
  );
}