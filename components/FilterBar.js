'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const YEARS = Array.from({ length: 30 }, (_, i) => 2025 - i);
const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'];
const LANGUAGES = ['English', 'Sinhala', 'Tamil', 'Hindi', 'Korean', 'Japanese', 'Spanish', 'French'];

export default function FilterBar({ type }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [year, setYear] = useState(searchParams.get('year') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const applyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (year) params.set('year', year);
    if (genre) params.set('genre', genre);
    if (language) params.set('language', language); // 👈 අලුතින් එකතු කළා
    router.push(`/${type}?${params.toString()}`);
    setShowMobileFilters(false);
  };

  return (
    <form onSubmit={applyFilters} className="bg-panel p-3 md:p-4 rounded-xl border border-white/10 mb-6">
      
      {/* උඩ පේළිය: Search එක සහ Mobile Filter බොත්තම */}
      <div className="flex gap-2 items-center">
        <input 
          type="text" 
          placeholder="Search titles..." 
          className="input-dark flex-1 text-sm py-2.5"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        
        {/* Mobile Filter බොත්තම */}
        <button 
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden bg-black/40 hover:bg-black/60 border border-white/10 px-3 py-2.5 rounded-lg text-white flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>

        {/* PC Dropdowns */}
        <select className="input-dark hidden md:block md:w-32 text-sm py-2.5" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        
        <select className="input-dark hidden md:block md:w-32 text-sm py-2.5" value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        {/* 👇 අලුත් Language Dropdown එක (PC) */}
        <select className="input-dark hidden md:block md:w-32 text-sm py-2.5" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">All Languages</option>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <button type="submit" className="hidden md:block btn-primary py-2.5 px-6 text-sm whitespace-nowrap">Search</button>
      </div>

      {/* Mobile එකේදී ඇරෙන Filter එක */}
      {showMobileFilters && (
        <div className="mt-3 flex flex-col gap-3 md:hidden animate-in slide-in-from-top-2 fade-in duration-200">
          <select className="input-dark text-sm py-2.5" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          
          <select className="input-dark text-sm py-2.5" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All Genres</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          {/* 👇 අලුත් Language Dropdown එක (Mobile) */}
          <select className="input-dark text-sm py-2.5" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">All Languages</option>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <button type="submit" className="btn-primary py-2.5 text-sm w-full">Apply Filters</button>
        </div>
      )}
    </form>
  );
}