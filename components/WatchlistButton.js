'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WatchlistButton({ itemId, itemType }) {
  const [isInList, setIsInList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/users/watchlist')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIsInList(data.some(item => item.itemId === itemId));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [itemId]);

  const toggleWatchlist = async () => {
    setLoading(true);
    try {
      if (isInList) {
        await fetch(`/api/users/watchlist?itemId=${itemId}`, { method: 'DELETE' });
        setIsInList(false);
      } else {
        const res = await fetch('/api/users/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId, itemType })
        });
        
        if (res.status === 401) {
          setShowLoginModal(true); 
          return;
        }
        
        setIsInList(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <button className="btn-ghost px-4 py-2 text-sm opacity-50">Loading...</button>;

  return (
    <>
      <button 
        onClick={toggleWatchlist}
        className={`inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-lg transition-all text-xs md:text-sm font-semibold border ${
          isInList 
            ? 'bg-white/20 border-white/30 text-white' 
            : 'bg-transparent border-white/20 text-gray-300 hover:text-white hover:border-white/50'
        }`}
      >
        {isInList ? (
          <><span>✓</span> Added to List</>
        ) : (
          <><span>+</span> My List</>
        )}
      </button>

      {/* 👇 අලුත්, ලස්සන Modal එක (Lock එක අයින් කළා) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0b0f1a] border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl animate-in zoom-in-95 duration-200">
            
            <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Sign in to add this to your personal list and keep track of everything you want to watch.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/login')}
                className="bg-accent hover:bg-blue-600 text-white font-semibold w-full py-3 rounded-lg transition-colors"
              >
                Login Now
              </button>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-xs text-gray-500 hover:text-white transition-colors py-2"
              >
                Maybe later
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}