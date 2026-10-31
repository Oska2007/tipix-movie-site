'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditMovie() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Subtitle අප්ලෝඩ් කරන්න ඕන දත්ත
  const [subLang, setSubLang] = useState('si');
  const [subLabel, setSubLabel] = useState('Sinhala');

  useEffect(() => {
    fetch(`/api/movies/${id}`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch movie');
        return res.json();
      })
      .then(data => {
        setForm({ ...data, genres: data.genres || '', language: data.language || 'English' });
      })
      .catch(err => setError(err.message));

    // පවතින Subtitle ටික ගන්නවා
    fetch(`/api/subtitles?targetId=${id}`)
      .then(res => res.json())
      .then(data => setSubs(data));
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
      }
    } catch (error) {
      alert("Error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // SRT ෆයිල් එක අප්ලෝඩ් කරන ෆන්ක්ෂන් එක
  async function uploadSubtitle(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      const res = await fetch('/api/subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId: id,
          targetType: 'movie',
          language: subLang,
          label: subLabel,
          content: content
        })
      });
      if (res.ok) {
        alert('Subtitle uploaded successfully!');
        // ලිස්ට් එක අප්ඩේට් කරන්න
        const updatedSubs = await (await fetch(`/api/subtitles?targetId=${id}`)).json();
        setSubs(updatedSubs);
      } else {
        alert('Failed to upload subtitle');
      }
    };
    reader.readAsText(file);
  }

  async function deleteSub(subId) {
    if (!confirm('Delete this subtitle?')) return;
    await fetch(`/api/subtitles/${subId}`, { method: 'DELETE' });
    setSubs(subs.filter(s => s.id !== subId));
  }

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!form) return <p className="p-6 text-accent animate-pulse">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Edit Movie</h1>
      <p className="text-xs text-muted font-mono">ID: {id}</p>
      
      {/* Movie විස්තර Save කරන ෆෝම් එක */}
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
        <input className="input-dark font-mono text-xs" placeholder="Magnet Link" value={form.torrentMagnet || ''} onChange={e => setForm({...form, torrentMagnet: e.target.value})} required />
        <textarea className="input-dark h-32" placeholder="Description" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
        
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update Movie Data'}
        </button>
      </form>

      {/* Subtitle Upload කරන කොටස */}
      <div className="bg-panel p-6 rounded-xl space-y-4 border border-white/10">
        <h2 className="text-lg font-bold text-white">Manage Subtitles</h2>
        
        {/* පවතින ඒවා පෙන්නනවා */}
        <div className="space-y-2">
          {subs.length === 0 && <p className="text-sm text-muted">No subtitles added yet.</p>}
          {subs.map(sub => (
            <div key={sub.id} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
              <span className="text-sm text-white">🌐 {sub.label} ({sub.language})</span>
              <button onClick={() => deleteSub(sub.id)} className="text-red-400 text-xs hover:underline">Delete</button>
            </div>
          ))}
        </div>

        {/* අලුතින් අප්ලෝඩ් කරන කොටස */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex gap-2">
            <select className="input-dark text-sm w-1/3" value={subLang} onChange={e => {setSubLang(e.target.value); setSubLabel(e.target.value === 'si' ? 'Sinhala' : 'English')}}>
              <option value="si">Sinhala</option>
              <option value="en">English</option>
            </select>
            <input className="input-dark text-sm w-2/3" placeholder="Label (e.g. Sinhala)" value={subLabel} onChange={e => setSubLabel(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept=".srt" 
              onChange={(e) => uploadSubtitle(e.target.files[0])}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}