'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // 👈 අලුතෙන් එකතු කළා

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const pathname = usePathname(); // 👈 අලුතෙන් එකතු කළා

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = async (e) => {
    e.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') setSupportsPWA(false);
    else setSupportsPWA(false);
    setPromptInstall(null);
  };

  // 👇 මේකෙන් Admin පැනලයේදී Notification එක අයින් කරනවා
  if (pathname.startsWith('/admin') || !supportsPWA || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-panel border border-accent/30 p-4 rounded-xl shadow-2xl shadow-accent/10 z-50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="App Icon" className="w-10 h-10 object-contain rounded-lg bg-black/50 p-1" />
        <div>
          <h3 className="text-white font-bold text-sm">Install Tipix App</h3>
          <p className="text-gray-400 text-xs">Watch movies faster on your device</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={onClick} className="bg-accent hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors whitespace-nowrap">
          Download
        </button>
        <button onClick={() => setIsDismissed(true)} className="text-gray-500 hover:text-gray-300 text-[10px] underline">
          Not now
        </button>
      </div>
    </div>
  );
}