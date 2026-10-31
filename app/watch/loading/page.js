'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get('target');
  const title = searchParams.get('title');
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (!targetUrl) return;
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(targetUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetUrl, router]);

  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center z-[100]">
      <div className="text-center space-y-6">
        <h1 className="text-2xl text-muted">Preparing your stream...</h1>
        <h2 className="text-3xl font-bold text-accent">{title}</h2>
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * count) / 5} className="text-accent transition-all duration-1000 ease-linear" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
            {count}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Connecting to fast servers...</p>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return <Suspense fallback={<div className="text-center py-20">Loading...</div>}><LoadingContent /></Suspense>;
}