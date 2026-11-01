'use client';
import { useState, useEffect } from 'react';

export default function LiveUsersWidget() {
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/live');
        const data = await res.json();
        if (data.count !== undefined) setLiveCount(data.count);
      } catch (e) {}
    };

    fetchLive();
    const interval = setInterval(fetchLive, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-panel p-6 rounded-xl border border-green-500/20 shadow-lg shadow-green-500/5 relative overflow-hidden">
      <div className="absolute top-4 right-4 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      <p className="text-sm text-green-400 mb-1 flex items-center gap-2">
        <span>🟢</span> Users Online Right Now
      </p>
      <h2 className="text-4xl font-bold text-green-400">{liveCount}</h2>
      <p className="text-xs text-gray-500 mt-2">Auto-updates every 10s</p>
    </div>
  );
}