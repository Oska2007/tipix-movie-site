'use client';
import { useRef, useState } from 'react';

export default function TorrentPlayer({ magnet, fileIndex = 0, subtitles = [] }) {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Manual Subtitle එකට අවශ්‍ය State
  const [manualSubUrl, setManualSubUrl] = useState(null);
  const [manualSubName, setManualSubName] = useState('');

  const streamUrl = `/api/stream?magnet=${encodeURIComponent(magnet)}&fileIndex=${fileIndex}`;

  // SRT to VTT Converter (Player එක ඇතුළේ)
  const convertSrtToVtt = (srt) => {
    if (!srt) return '';
    if (srt.trim().startsWith('WEBVTT')) return srt;
    return 'WEBVTT\n\n' + srt
      .replace(/\r+/g, '')
      .replace(/^\uFEFF/, '')
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
      .trim();
  };

  // ෆයිල් එක තේරුවම වෙන දේ
  const handleManualSubUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const vtt = convertSrtToVtt(content);
      
      // බ්ලොබ් එකක් හදලා ඒක URL එකක් කරනවා
      const blob = new Blob([vtt], { type: 'text/vtt' });
      const url = URL.createObjectURL(blob);
      
      setManualSubUrl(url);
      setManualSubName(file.name);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative rounded-xl overflow-hidden bg-[#05060a] border border-primary/30 shadow-lg min-h-[300px] flex items-center justify-center">
        
        {isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05060a] z-20">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-sm font-semibold">Connecting to Real-Debrid...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05060a] z-20 p-6 text-center">
            <span className="text-red-500 text-4xl mb-3">⚠️</span>
            <p className="text-red-400 font-bold mb-2">Playback Error</p>
            <p className="text-gray-400 text-xs max-w-md">{error}</p>
          </div>
        )}

        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className={`w-full aspect-video bg-black transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          src={streamUrl}
          onLoadedData={() => setIsLoading(false)}
          onCanPlay={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError("Video failed to load. The torrent might be dead or Real-Debrid is still downloading it.");
          }}
        >
          {/* Database එකේ තියෙන Subtitles (Default අයින් කරලා) */}
          {subtitles.map(sub => (
            <track
              key={sub.id}
              kind="subtitles"
              src={`/api/subtitles/${sub.id}`}
              srcLang={sub.language}
              label={sub.label}
            />
          ))}

          {/* Manual Upload කරපු Subtitle එක */}
          {manualSubUrl && (
            <track
              kind="subtitles"
              src={manualSubUrl}
              srcLang="manual"
              label={manualSubName}
              default // අප්ලෝඩ් කරපු එක ඔටෝම ප්ලේ වෙන්න default දැම්මා
            />
          )}
        </video>
      </div>

      {/* Manual Subtitle Load කරන බොත්තම */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            Load Custom Subtitle (.srt)
            <input 
              type="file" 
              accept=".srt" 
              className="hidden" 
              onChange={handleManualSubUpload} 
            />
          </label>
          {manualSubName && <span className="text-xs text-accent">Loaded: {manualSubName}</span>}
        </div>

        {/* CC බොත්තම ගැන මතක් කිරීමක් */}
        <span className="text-[10px] text-gray-500 hidden md:block">
          * Use the CC button on video to select language
        </span>
      </div>
    </div>
  );
}