'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManualEpisodeAdder({ seriesId, seasonId, seasonNumber }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ episode: '', title: '', torrentMagnet: '', fileIndex: 0 });
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/episodes/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          seriesId,
          seasonId,
          season: seasonNumber
        }),
      });
      if (res.ok) {
        setForm({ episode: '', title: '', torrentMagnet: '', fileIndex: 0 });
        setIsOpen(false);
        router.refresh();
      } else {
        alert("Failed to add episode");
      }
    } catch (err) {
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="text-xs bg-white/5 hover:bg-white/10 text-accent px-3 py-1.5 rounded transition mt-2">
        + Add Single Episode Manually
      </button>
    );
  }

  return (
    <form onSubmit={save} className="mt-4 p-4 bg-black/30 rounded-lg border border-white/10 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-bold text-white">Add Episode to Season {seasonNumber}</h4>
        <button type="button" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-xs">Cancel</button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input type="number" placeholder="Ep #" className="input-dark text-sm" value={form.episode} onChange={e => setForm({...form, episode: e.target.value})} required />
        <input type="text" placeholder="Episode Title" className="input-dark text-sm md:col-span-2" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <input type="number" placeholder="File Index (0)" className="input-dark text-sm" value={form.fileIndex} onChange={e => setForm({...form, fileIndex: e.target.value})} />
      </div>
      
      <input type="text" placeholder="Magnet Link or Torrent Link" className="input-dark text-sm font-mono text-xs" value={form.torrentMagnet} onChange={e => setForm({...form, torrentMagnet: e.target.value})} required />
      
      <button type="submit" className="btn-primary text-xs py-1.5 px-4" disabled={loading}>
        {loading ? 'Adding...' : 'Save Episode'}
      </button>
    </form>
  );
}