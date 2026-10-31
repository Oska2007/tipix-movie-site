'use client';
import { useState } from 'react';

export default function AdminSubtitles() {
  const [form, setForm] = useState({ targetType:'movie', targetId:'', language:'si', label:'Sinhala', content:'' });
  const [msg, setMsg] = useState('');

  async function save(e) {
    e.preventDefault();
    const res = await fetch('/api/subtitles', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg('✅ Subtitle added!');
      setForm({ ...form, content:'' });
    } else {
      setMsg('❌ Failed');
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">💬 Add Subtitle (direct)</h1>
      <p className="text-sm text-muted">💡 Tip: For series, use "Manage Seasons" → episode's "Subtitles" button instead.</p>
      <form onSubmit={save} className="bg-panel p-4 rounded-xl space-y-3 border border-white/10">
        <select className="input-dark" value={form.targetType} onChange={e => setForm({...form, targetType:e.target.value})}>
          <option value="movie">Movie</option>
          <option value="episode">Episode</option>
        </select>
        <input className="input-dark" placeholder="Target ID (_id)" value={form.targetId} onChange={e => setForm({...form,targetId:e.target.value})} required />
        <div className="grid grid-cols-2 gap-2">
          <input className="input-dark" placeholder="Language code (si, en)" value={form.language} onChange={e => setForm({...form,language:e.target.value})} />
          <input className="input-dark" placeholder="Label (Sinhala, English)" value={form.label} onChange={e => setForm({...form,label:e.target.value})} />
        </div>
        <textarea className="input-dark h-48 font-mono text-xs" placeholder="Paste SRT content here..." value={form.content} onChange={e => setForm({...form,content:e.target.value})} required />
        <button className="btn-primary">💾 Save Subtitle</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}