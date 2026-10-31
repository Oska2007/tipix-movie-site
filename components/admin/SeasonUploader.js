'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SeasonUploader({ seriesId }) {
  const router = useRouter();
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [magnet, setMagnet] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleParse(e) {
    e.preventDefault();
    setError('');
    setParsed(null);
    setParsing(true);

    try {
      const res = await fetch('/api/seasons/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ magnet }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Parse failed');

      setParsed(data);
      setEpisodes(data.episodes);
    } catch (err) {
      setError(err.message);
    } finally {
      setParsing(false);
    }
  }

  function updateEpisode(i, patch) {
    setEpisodes(prev => prev.map((ep, idx) => idx === i ? { ...ep, ...patch } : ep));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/seasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seriesId,
          seasonNumber,
          torrentMagnet: magnet,
          infoHash: parsed.infoHash,
          torrentName: parsed.name,
          episodes: episodes.map(ep => ({
            fileIndex: ep.fileIndex,
            fileName: ep.fileName,
            size: ep.size,
            episode: ep.episode,
            title: ep.title,
          })),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      router.refresh();
      setParsed(null);
      setMagnet('');
      setEpisodes([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleParse} className="bg-panel p-4 rounded-xl space-y-3 border border-white/10">
        <h2 className="text-lg font-bold text-accent">Add Season via Magnet</h2>

        <div className="grid md:grid-cols-[120px_1fr] gap-3">
          <input
            type="number"
            min={1}
            className="input-dark"
            placeholder="Season #"
            value={seasonNumber}
            onChange={e => setSeasonNumber(+e.target.value)}
          />
          <input
            className="input-dark font-mono text-xs"
            placeholder="magnet:?xt=urn:btih:..."
            value={magnet}
            onChange={e => setMagnet(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={parsing || !magnet} className="btn-primary disabled:opacity-50">
          {parsing ? '⏳ Parsing torrent (10-45s)...' : '🔍 Parse Torrent'}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>

      {parsed && (
        <div className="bg-panel p-4 rounded-xl border border-primary/30 space-y-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-lg font-bold text-accent">
              ✅ {parsed.episodes.length} episodes detected in "{parsed.name}"
            </h3>
            <span className="text-xs text-muted">Total files: {parsed.totalFiles}</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {episodes.map((ep, i) => (
              <div key={i} className="grid md:grid-cols-[80px_70px_1fr_120px] gap-2 items-center bg-bg p-2 rounded-lg border border-white/5">
                <span className="text-xs text-muted truncate">idx {ep.fileIndex}</span>
                <input
                  type="number"
                  className="input-dark text-sm"
                  value={ep.episode}
                  onChange={e => updateEpisode(i, { episode: +e.target.value })}
                />
                <input
                  className="input-dark text-sm"
                  value={ep.title}
                  onChange={e => updateEpisode(i, { title: e.target.value })}
                />
                <span className="text-xs text-muted text-right">{(ep.size / 1024 / 1024).toFixed(0)} MB</span>
              </div>
            ))}
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : `💾 Save Season ${seasonNumber} with ${episodes.length} episodes`}
          </button>
        </div>
      )}
    </div>
  );
}