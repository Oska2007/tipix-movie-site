'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditSeries() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/series/${id}`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch series data');
        return res.json();
      })
      .then(data => {
        setForm({ 
          ...data, 
          // 👇 මෙන්න මේක තමයි වෙනස් කළේ (Array එකක් නම් join කරනවා, නැත්නම් එහෙමම තියනවා)
          genres: Array.isArray(data.genres) ? data.genres.join(', ') : (data.genres || ''),
          language: data.language || 'English'
        });
      })
      .catch(err => {
        setError(err.message);
      });
  }, [id]);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { 
        ...form, 
        year: form.year ? Number(form.year) : null, 
        rating: form.rating ? Number(form.rating) : null, 
        // API එකට යවද්දී ආයේ Array එකක් කරලා යවනවා (එතන API එකෙන් ආයේ String කරනවා)
        genres: form.genres.split(',').map(s => s.trim()).filter(Boolean) 
      };
      
      const res = await fetch(`/api/series/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });
      
      if (res.ok) {
        router.push('/admin/series');
        router.refresh();
      } else {
        alert("Failed to update series.");
      }
    } catch (error) {
      alert("Error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!form) return <p className="p-6 text-accent animate-pulse">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Edit TV Series</h1>
      <p className="text-xs text-muted font-mono">ID: {id}</p>
      
      <form onSubmit={save} className="bg-panel p-6 rounded-xl space-y-4 border border-white/10">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input-dark" placeholder="Title" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} required />
          <input className="input-dark" placeholder="Year" type="number" value={form.year || ''} onChange={e => setForm({...form, year: e.target.value})} />
          
          <input className="input-dark" placeholder="Poster URL" value={form.poster || ''} onChange={e => setForm({...form, poster: e.target.value})} />
          <input className="input-dark" placeholder="Backdrop URL" value={form.backdrop || ''} onChange={e => setForm({...form, backdrop: e.target.value})} />
          
          <input className="input-dark" placeholder="Rating" type="number" step="0.1" value={form.rating || ''} onChange={e => setForm({...form, rating: e.target.value})} />
          <input className="input-dark" placeholder="Genres" value={form.genres || ''} onChange={e => setForm({...form, genres: e.target.value})} />
          
          <input className="input-dark md:col-span-2" placeholder="Language" value={form.language || ''} onChange={e => setForm({...form, language: e.target.value})} />
        </div>
        
        <textarea className="input-dark h-32" placeholder="Description" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
        
        <div className="flex gap-4">
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Series'}
          </button>
          <button type="button" onClick={() => router.push('/admin/series')} className="btn-ghost w-full">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}