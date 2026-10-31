'use client';
import { useState } from 'react';
import EpisodeSubtitleEditor from './EpisodeSubtitleEditor';

export default function EpisodeRow({ episode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[60px_1fr_auto_auto] gap-2 items-center bg-bg p-2 rounded-lg border border-white/5">
        <span className="text-sm font-bold text-accent">E{episode.episode}</span>
        <span className="text-sm truncate">{episode.title || episode.fileName}</span>
        <span className="text-xs text-muted">{episode.subtitles?.length || 0} subs</span>
        <button onClick={() => setOpen(true)} className="btn-ghost text-xs py-1 px-3">
          💬 Subtitles
        </button>
      </div>

      {open && <EpisodeSubtitleEditor episode={episode} onClose={() => setOpen(false)} />}
    </>
  );
}