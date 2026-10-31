'use client';
import { useState } from 'react';

export default function TMDBImport({ type, onImport }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Image Selection State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedBackdrop, setSelectedBackdrop] = useState(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch('/api/import/tmdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type, action: 'search' })
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id) => {
    setLoading(true);
    try {
      const res = await fetch('/api/import/tmdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: id, type, action: 'details' })
      });
      const data = await res.json();
      
      setFetchedData(data.data);
      // පළවෙනි පින්තූරය Default විදිහට තෝරලා තියමු
      setSelectedPoster(data.data.allPosters[0] || '');
      setSelectedBackdrop(data.data.allBackdrops[0] || '');
      setIsModalOpen(true); // ඉමේජ් තෝරන වින්ඩෝ එක අරිනවා
      
      setResults([]);
      setQuery('');
    } catch (err) {
      alert('Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  const applySelection = () => {
    // තෝරාගත්ත පින්තූර ප්‍රධාන ෆෝම් එකට යවනවා
    const finalData = {
      ...fetchedData,
      poster: selectedPoster,
      backdrop: selectedBackdrop
    };
    // allPosters සහ allBackdrops ෆෝම් එකට යවන්න ඕන නෑ, ඒ නිසා අයින් කරනවා
    delete finalData.allPosters;
    delete finalData.allBackdrops;

    onImport(finalData);
    setIsModalOpen(false);
    setFetchedData(null);
  };

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 space-y-3 relative">
      <h3 className="text-accent font-bold text-sm flex items-center gap-2">
        <span>✨</span> Auto-fill from TMDB
      </h3>
      <p className="text-xs text-gray-400">Type the name and select the correct {type === 'movie' ? 'movie' : 'TV series'}.</p>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder={`Search ${type === 'movie' ? 'movie' : 'TV series'} name...`}
          className="input-dark flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
        />
        <button type="button" onClick={handleSearch} disabled={loading} className="btn-primary py-2 px-4 text-sm">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-black/40 rounded-lg border border-white/10 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <div key={item.id} onClick={() => handleSelect(item.id)} className="flex items-center gap-3 p-2 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0">
              {item.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} alt="poster" className="w-10 h-14 object-cover rounded" />
              ) : (
                <div className="w-10 h-14 bg-gray-800 rounded flex items-center justify-center text-[8px]">No Img</div>
              )}
              <div>
                <p className="text-sm text-white font-medium">{item.title || item.name}</p>
                <p className="text-xs text-gray-400">{(item.release_date || item.first_air_date)?.split('-')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 👇 ඉමේජ් තෝරන Modal එක */}
      {isModalOpen && fetchedData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-panel border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-lg font-bold text-white">Select Images for: {fetchedData.title}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-6">
              {/* Posters */}
              <div>
                <h3 className="text-sm font-bold text-accent mb-2">1. Select a Poster (Vertical)</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {fetchedData.allPosters.map((url, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedPoster(url)}
                      className={`relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedPoster === url ? 'border-accent scale-105 shadow-lg shadow-accent/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={url} alt="poster" className="w-full h-full object-cover" />
                      {selectedPoster === url && <div className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Selected</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Backdrops */}
              <div>
                <h3 className="text-sm font-bold text-accent mb-2">2. Select a Backdrop (Landscape)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {fetchedData.allBackdrops.map((url, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedBackdrop(url)}
                      className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedBackdrop === url ? 'border-accent scale-105 shadow-lg shadow-accent/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={url} alt="backdrop" className="w-full h-full object-cover" />
                      {selectedBackdrop === url && <div className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Selected</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost py-2 px-4 text-sm">Cancel</button>
              <button onClick={applySelection} className="btn-primary py-2 px-6 text-sm">Apply Selected Images</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}