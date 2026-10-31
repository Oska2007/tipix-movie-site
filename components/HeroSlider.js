'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

export default function HeroSlider({ items }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi, isPaused, items.length]);

  if (!items || items.length === 0) return null;

  return (
    <div 
      className="relative w-full h-[420px] md:h-[75vh] bg-black overflow-hidden -mt-16 md:-mt-20 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      <div className="overflow-hidden h-full w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex h-full w-full">
          
          {items.map((item) => (
            <div key={item.id} className="relative flex-[0_0_100%] h-full min-w-0 select-none">
              
              <img 
                src={item.backdrop} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover object-top opacity-90 pointer-events-none"
              />
              
              {/* උඩින් අඳුරු වීම (Navbar එකට) */}
              <div className="absolute inset-x-0 top-0 h-32 md:h-56 bg-gradient-to-b from-[#05060a] via-[#05060a]/80 to-transparent pointer-events-none"></div>
              
              {/* පහළින් තියෙන අඳුරු ග්‍රේඩියන්ට් එක */}
              <div className="absolute inset-x-0 bottom-0 h-[50%] md:h-[60%] bg-gradient-to-t from-[#05060a] via-[#05060a]/70 via-30% to-transparent pointer-events-none"></div>

              {/* විස්තර ටික */}
              <div className="absolute inset-0 flex flex-col justify-end pb-6 md:pb-10 pointer-events-none">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                  
                  <div className="max-w-2xl space-y-1.5 md:space-y-2">
                    
                    <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-xl leading-tight">
                      {item.title}
                    </h1>
                    
                    <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-300 font-medium">
                      <span className="text-accent font-bold bg-accent/10 px-1.5 py-0.5 rounded">⭐ {item.rating || 'N/A'}</span>
                      <span>•</span>
                      <span>{item.year}</span>
                      {item.duration && <><span>•</span><span>{item.duration}</span></>}
                    </div>
                    
                    <p className="text-[11px] md:text-sm text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-xl drop-shadow-md hidden sm:block">
                      {item.description}
                    </p>
                    
                    <div className="pt-2 pointer-events-auto">
                      <Link 
                        // 👇 මෙතන encodeURIComponent සහ target="_blank" දැම්මා
                        href={`/watch/loading?target=${encodeURIComponent(`${item.seasons ? '/watch/episode/' : '/watch/movie/'}${item.id}`)}&title=${encodeURIComponent(item.title)}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-accent hover:bg-blue-600 text-white font-semibold px-4 py-1.5 md:px-5 md:py-2 rounded-md transition-all shadow-lg shadow-accent/30 hover:scale-105 text-xs md:text-sm"
                      >
                        <span className="text-xs md:text-base">▶</span> Watch Now
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* පහළින් තියෙන තිත් (Dots) */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`transition-all duration-300 rounded-full ${
              selectedIndex === idx ? 'bg-accent w-6 h-1.5' : 'bg-white/30 hover:bg-white/60 w-1.5 h-1.5'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}