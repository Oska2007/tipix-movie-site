'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EpisodeSubtitleEditor({ episode, onClose }) {
  const router = useRouter();
  const [subs, setSubs] = useState(episode.subtitles || []);
  const [form, setForm] = useState({ language: 'si', label: 'Sinhala', content: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function addSub(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'episode',
          targetId: episode._id,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSubs(prev => [...prev, data]);
      setForm({ ...form, content: '' });
      setMsg('✅ Subtitle added');
      router.refresh();
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeSub(id) {
    if (!confirm('Delete subtitle?')) return;
    await fetch(`/api/subtitles/${id}`, { method: 'DELETE' });
    setSubs(prev => prev.filter(s => s._id !== id));
    router.refresh();
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-panel rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-primary/30"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">Subtitles</h2>
            <p className="text-sm text-muted">S{episode.season}E{episode.episode} — {episode.title}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="space-y-2 mb-4">
          {subs.length === 0 && <p className="text-sm text-muted">No subtitles yet.</p>}
          {subs.map(s => (
            <div key={s._id} className="bg-bg p-2 rounded flex justify-between items-center border border-white/5">
              <span className="text-sm">🌐 {s.label} ({s.language})</span>
              <button onClick={() => removeSub(s._id)} className="text-red-400 text-xs hover:underline">Delete</button>
            </div>
          ))}
        </div>

        <form onSubmit={addSub} className="space-y-3 border-t border-white/10 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <input className="input-dark" placeholder="lang (si, en)" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} />
            <input className="input-dark" placeholder="Label (Sinhala)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
          </div>
          <textarea
            className="input-dark h-40 font-mono text-xs"
            placeholder="Paste SRT content here..."
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            required
          />
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving...' : '+ Add Subtitle'}</button>
          {msg && <p className="text-sm">{msg}</p>}
        </form>
      </div>
    </div>
  );
}