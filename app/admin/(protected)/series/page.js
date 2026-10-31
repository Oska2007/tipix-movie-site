'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminSeries() {
  const [series, setSeries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      // cache: 'no-store' දැම්මම අලුත්ම දත්ත එනවා
      const res = await fetch('/api/series', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSeries(data);
      }
    } catch (error) {
      console.error("Failed to load series", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function del(id) {
    if (!confirm('⚠️ Are you sure? This will delete the series and ALL its seasons & episodes!')) return;
    try {
      await fetch(`/api/series/${id}`, { method: 'DELETE' });
      load(); // අයින් කරාට පස්සේ ලිස්ට් එක අප්ඩේට් කරනවා
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete series.");
    }
  }

  // Search කරන වචනයට අදාළ සීරීස් විතරක් ෆිල්ටර් කරනවා
  const filteredSeries = series.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Add Button */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-white">📺 Manage TV Series</h1>
        <Link href="/admin/series/new" className="btn-primary text-sm">
          + Add Series
        </Link>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-md">
        <input 
          type="text" 
          placeholder="Search TV series by title..." 
          className="input-dark"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Series List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-accent animate-pulse">Loading series data...</p>
        ) : filteredSeries.length === 0 ? (
          <p className="text-muted">No series found matching "{search}".</p>
        ) : (
          filteredSeries.map(s => (
            // 👇 මෙතන s._id වෙනුවට s.id දැම්මා
            <div key={s.id} className="bg-panel p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center border border-white/5 gap-4 transition-colors hover:border-white/10">
              
              {/* Title and ID */}
              <div>
                <span className="font-bold text-lg text-white">
                  {s.title} {s.year && <span className="text-muted text-base font-normal">({s.year})</span>}
                </span>
                {/* 👇 මෙතනත් s.id දැම්මා */}
                <p className="text-xs text-muted font-mono mt-1">ID: {s.id}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto">
                
                {/* 👇 මේ ලින්ක් එකේ s.id දැම්මා */}
                <Link 
                  href={`/admin/series/${s.id}`} 
                  className="bg-primary hover:bg-blue-600 text-white text-sm py-1.5 px-4 rounded-lg transition-colors flex-1 md:flex-none text-center font-medium"
                >
                  Seasons & Episodes
                </Link>

                {/* 👇 මේ ලින්ක් එකේ s.id දැම්මා */}
                <Link 
                  href={`/admin/series/edit/${s.id}`} 
                  className="btn-ghost text-sm py-1.5 px-4 flex-1 md:flex-none text-center"
                >
                  Edit
                </Link>

                {/* 👇 Delete ෆන්ක්ෂන් එකට s.id දැම්මා */}
                <button 
                  onClick={() => del(s.id)} 
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm py-1.5 px-4 rounded-lg transition-colors flex-1 md:flex-none"
                >
                  Delete
                </button>
                
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}