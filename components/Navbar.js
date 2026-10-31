'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        if (currentScrollY > lastScrollY.current) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setIsScrolled(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-[#05060a] shadow-[0_4px_30px_rgba(0,0,0,0.8)]' // ස්ක්‍රෝල් කරද්දී හැම තැනම කළු
          // 👇 ස්ක්‍රෝල් නොකරද්දී: වම් පැත්තේ ඉඳන් තද කළු, දකුණට යද්දී විනිවිද පේනවා
          : 'bg-gradient-to-r from-[#05060a] via-[#05060a]/90 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 md:py-3">
        
        {/* ලෝගෝ එක */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* ලෝගෝ එකේ උස පොඩ්ඩක් අඩු කළා (h-8 md:h-10) එතකොට ලස්සනට හෙඩර් එකට ගැළපෙනවා */}
          <img 
            src="/logo.png" 
            alt="Tipix Logo" 
            className="h-9 md:h-11 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>

        {/* බොත්තම් දෙක */}
        <div className="flex gap-6 md:gap-8 text-sm md:text-base font-semibold">
          <Link href="/movies" className="text-gray-200 hover:text-white transition-colors">
            Movies
          </Link>
          <Link href="/series" className="text-gray-200 hover:text-white transition-colors">
            TV Series
          </Link>
        </div>
      </div>
    </nav>
  );
}