'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const router = useRouter();

  // ලොග් වෙලා ඉන්නවද බලනවා
  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  // Scroll වෙද්දී Navbar එක හංගන/පෙන්නන ලොජික් එක
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        if (currentScrollY > lastScrollY.current) {
          setIsVisible(false); // යටට යනවා -> හංගන්න
        } else {
          setIsVisible(true); // උඩට එනවා -> පෙන්නන්න
        }
        setIsScrolled(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  }

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-[#05060a]/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-[#05060a] via-[#05060a]/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        
        {/* ලෝගෝ එක */}
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.png" 
            alt="Tipix Logo" 
            className="h-9 md:h-11 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>

        {/* මෙනු එක */}
        <div className="flex items-center gap-5 md:gap-8 text-sm md:text-base font-semibold drop-shadow-lg">
          <Link href="/movies" className="text-gray-200 hover:text-white transition-colors">Movies</Link>
          <Link href="/series" className="text-gray-200 hover:text-white transition-colors">TV Series</Link>
          
          {/* ලොග් වෙලා ඉන්නවා නම් My List සහ Profile පෙන්නනවා */}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
              <Link href="/my-list" className="text-gray-200 hover:text-accent transition-colors">My List</Link>
              <span className="text-accent font-bold text-xs md:text-sm hidden sm:block">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-xs md:text-sm">Logout</button>
            </div>
          ) : (
            /* ලොග් වෙලා නැත්නම් Login බොත්තම පෙන්නනවා */
            <Link href="/login" className="bg-accent hover:bg-blue-600 text-white px-4 py-1.5 rounded-md transition-colors text-xs md:text-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}