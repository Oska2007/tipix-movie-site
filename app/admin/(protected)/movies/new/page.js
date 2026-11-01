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
  
  // සබ්ටයිටල් සඳහා අලුත් State
  const [subLang, setSubLang] = useState('si');
  const [subLabel, setSubLabel] = useState('Sinhala');
  const [subContent, setSubContent] = useState('');
  const [loading, setLoading] = useState(false);

  // SRT ෆයිල් එක තේරුවම කියවන්න
  const handleSubFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setSubContent(event.target.result);
    reader.readAsText(file);
  };

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. මුලින්ම Movie එක සේව් කරගන්න
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
      
      if (!res.ok) throw new Error("Failed to save movie");
      
      const newMovie = await res.json(); // අලුත් Movie එකේ ID එක ගන්නවා

      // 2. සබ්ටයිටල් එකක් අප්ලෝඩ් කරලා තියෙනවා නම්, ඒක දැන් සේව් කරන්න
      if (subContent) {
        await fetch('/api/subtitles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetType: 'movie',
            targetId: newMovie.id, // 👈 මෙන්න මේ අලුත් ID එකට ලින්ක් කරනවා
            language: subLang,
            label: subLabel,
            content: subContent
          })
        });
      }

      router.push('/admin/movies');
      router.refresh();
    } catch (error) {
      alert("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Add New Movie</h1>
      
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
        
        <div className="space-y-3 pt-2">
          <input className="input-dark font-mono text-xs" placeholder="720p Magnet Link" value={form.torrent720p} onChange={e => setForm({...form, torrent720p: e.target.value})} />
          <input className="input-dark font-mono text-xs" placeholder="1080p Magnet Link" value={form.torrent1080p} onChange={e => setForm({...form, torrent1080p: e.target.value})} />
        </div>
        
        <textarea className="input-dark h-32" placeholder="Description" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />

        {/* 👇 මෙන්න මේක තමයි අලුතෙන් දැම්ම Subtitle Upload කොටස */}
        <div className="bg-black/30 p-4 rounded-xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-accent">Add Subtitle (Optional)</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <select className="input-dark text-sm" value={subLang} onChange={e => {setSubLang(e.target.value); setSubLabel(e.target.value === 'si' ? 'Sinhala' : 'English')}}>
              <option value="si">Sinhala</option>
              <option value="en">English</option>
            </select>
            <input className="input-dark text-sm" placeholder="Label (e.g. Sinhala)" value={subLabel} onChange={e => setSubLabel(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
             <input 
              type="file" 
              accept=".srt" 
              onChange={handleSubFile}
              className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer"
            />
            <button
              type="button"
              onClick={async () => {
                const magnetToUse = form.torrent720p || form.torrent1080p;
                if (!magnetToUse) return alert('Please enter a 720p or 1080p Magnet Link first.');
                const btn = document.getElementById('dl-btn-new');
                btn.innerText = 'Fetching...';
                btn.disabled = true;
                try {
                  const res = await fetch('/api/movies/download-subtitle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ magnet: magnetToUse })
                  });
                  if (res.ok) {
                    const text = await res.text();
                    setSubContent(text); // ඩවුන්ලෝඩ් වුන SRT එක state එකට දානවා
                    alert("SRT downloaded successfully! It will be saved with the movie.");
                  } else {
                    alert(await res.text());
                  }
                } catch (err) {
                  alert("Error downloading subtitle");
                } finally {
                  btn.innerText = '📥 Download SRT from Torrent';
                  btn.disabled = false;
                }
              }}
              id="dl-btn-new"
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs px-4 py-2 rounded-lg transition w-fit"
            >
              📥 Download SRT from Torrent
            </button>
          </div>
        </div>
        
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save Movie'}
        </button>
      </form>
    </div>
  );
}