'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditMovie() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/movies/${id}`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch movie data');
        return res.json();
      })
      .then(data => {
        setForm({ 
          ...data, 
          genres: data.genres || '', 
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
        genres: form.genres.split(',').map(s => s.trim()).filter(Boolean) 
      };
      
      const res = await fetch(`/api/movies/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });
      
      if (res.ok) {
        router.push('/admin/movies');
        router.refresh();
      } else {
        alert("Failed to update movie.");
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
      <h1 className="text-2xl font-bold text-white">Edit Movie</h1>
      <p className="text-xs text-muted font-mono">ID: {id}</p>
      
      <form onSubmit={save} className="bg-panel p-6 rounded-xl space-y-4 border border-white/10">
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input-dark" placeholder="Title" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} required />
          <input className="input-dark" placeholder="Year" type="number" value={form.year || ''} onChange={e => setForm({...form, year: e.target.value})} />
          
          <input className="input-dark" placeholder="Poster URL" value={form.poster || ''} onChange={e => setForm({...form, poster: e.target.value})} />
          <input className="input-dark" placeholder="Backdrop URL" value={form.backdrop || ''} onChange={e => setForm({...form, backdrop: e.target.value})} />
          
          <input className="input-dark" placeholder="Rating" type="number" step="0.1" value={form.rating || ''} onChange={e => setForm({...form, rating: e.target.value})} />
          <input className="input-dark" placeholder="Duration" value={form.duration || ''} onChange={e => setForm({...form, duration: e.target.value})} />
          
          <input className="input-dark" placeholder="Genres" value={form.genres || ''} onChange={e => setForm({...form, genres: e.target.value})} />
          <input className="input-dark" placeholder="Language" value={form.language || ''} onChange={e => setForm({...form, language: e.target.value})} />
        </div>
        
        {/* 👇 මෙන්න මේක තමයි වෙනස් වුනේ (720p සහ 1080p කොටු දෙක) */}
        <div className="space-y-3 pt-2">
          <input className="input-dark font-mono text-xs" placeholder="720p Magnet Link" value={form.torrent720p || ''} onChange={e => setForm({...form, torrent720p: e.target.value})} />
          <input className="input-dark font-mono text-xs" placeholder="1080p Magnet Link" value={form.torrent1080p || ''} onChange={e => setForm({...form, torrent1080p: e.target.value})} />
        </div>
        
        {/* SRT බොත්තම - දැන් අර උඩ තියෙන ලින්ක් එකකින් ඩවුන්ලෝඩ් කරයි */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={async () => {
              const magnetToUse = form.torrent720p || form.torrent1080p;
              if (!magnetToUse) return alert('Please enter a 720p or 1080p Magnet Link first.');
              
              const btn = document.getElementById('dl-btn');
              const originalText = btn.innerText;
              btn.innerText = 'Fetching...';
              btn.disabled = true;
              try {
                const res = await fetch('/api/movies/download-subtitle', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ magnet: magnetToUse }) // 👈 අලුත් ලින්ක් එක යවනවා
                });
                if (res.ok) {
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${form.title || 'subtitle'}.srt`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                } else {
                  const text = await res.text();
                  alert(text);
                }
              } catch (err) {
                alert("Error downloading subtitle");
              } finally {
                btn.innerText = originalText;
                btn.disabled = false;
              }
            }}
            id="dl-btn"
            className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs px-4 py-2 rounded-lg transition"
          >
            📥 Download SRT from Torrent
          </button>
        </div>

        <textarea className="input-dark h-32" placeholder="Description" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
        
        <div className="flex gap-4 pt-2">
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Movie Data'}
          </button>
          <button type="button" onClick={() => router.push('/admin/movies')} className="btn-ghost w-full">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}