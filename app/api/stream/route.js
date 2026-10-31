import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel/Next.js එකේ Timeout එක වැඩි කරනවා

const RD_API = 'https://api.real-debrid.com/rest/1.0';
const RD_TOKEN = process.env.REAL_DEBRID_API_KEY;

async function rdFetch(endpoint, options = {}) {
  if (!RD_TOKEN) throw new Error('Real-Debrid API Key is missing in .env.local');
  
  const res = await fetch(`${RD_API}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${RD_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...options.headers,
    },
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Real-Debrid API Error');
  return data;
}

async function getRealDebridLink(magnet) {
  // 1. ටොරන්ට් එක Real-Debrid එකට Add කරනවා
  const addRes = await rdFetch('/torrents/addMagnet', {
    method: 'POST',
    body: new URLSearchParams({ magnet }),
  });
  const torrentId = addRes.id;

  // 2. ටොරන්ට් එකේ විස්තර එනකන් ඉන්නවා
  let info = await rdFetch(`/torrents/info/${torrentId}`);
  
  // ටොරන්ට් එකේ ෆයිල්ස් තාම ලෝඩ් වෙලා නැත්නම් (මේක තමයි හිරවෙන්න හේතුව)
  if (info.status === 'waiting_files_selection') {
    // හැම ෆයිල් එකක්ම තෝරගන්නවා
    const files = info.files.map(f => f.id).join(',');
    await rdFetch(`/torrents/selectFiles/${torrentId}`, {
      method: 'POST',
      body: new URLSearchParams({ files }),
    });
    info = await rdFetch(`/torrents/info/${torrentId}`);
  }

  // ටොරන්ට් එක Real-Debrid එකේ බාගන්න ගන්නවා නම්, ඒක ඉක්මනට බාගන්න බෑ.
  // ඒත් Real-Debrid එකේ කලින් තිබ්බ එකක් නම් (Cached), මේක තත්පර 2න් ඉවර වෙනවා.
  if (info.status !== 'downloaded') {
    throw new Error(`Real-Debrid is downloading this torrent. Please wait a few minutes and try again. (Status: ${info.status})`);
  }

  if (!info.links || info.links.length === 0) {
    throw new Error('No video links found in this torrent.');
  }

  // 3. හොඳම වීඩියෝ ෆයිල් එක තෝරගන්නවා
  let bestLink = info.links[0];
  let maxSize = 0;
  if (info.files && info.files.length > 0) {
    info.files.forEach((file, index) => {
      if (file.bytes > maxSize && /\.(mp4|mkv|webm|mov)$/i.test(file.path)) {
        maxSize = file.bytes;
        bestLink = info.links[index];
      }
    });
  }

  // 4. Direct ලින්ක් එක ගන්නවා
  const unrestrictRes = await rdFetch('/unrestrict/link', {
    method: 'POST',
    body: new URLSearchParams({ link: bestLink }),
  });

  return unrestrictRes.download; 
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const magnet = decodeURIComponent(searchParams.get('magnet') || '');
  const range = req.headers.get('range');

  if (!magnet) return new NextResponse('Missing magnet', { status: 400 });

  try {
    const directUrl = await getRealDebridLink(magnet);

    const fetchHeaders = new Headers();
    if (range) fetchHeaders.set('Range', range);

    const videoRes = await fetch(directUrl, { headers: fetchHeaders });

    if (!videoRes.ok) throw new Error('Failed to fetch video stream from Real-Debrid');

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'video/mp4');
    responseHeaders.set('Accept-Ranges', 'bytes');
    
    if (videoRes.headers.has('Content-Range')) responseHeaders.set('Content-Range', videoRes.headers.get('Content-Range'));
    if (videoRes.headers.has('Content-Length')) responseHeaders.set('Content-Length', videoRes.headers.get('Content-Length'));

    return new NextResponse(videoRes.body, {
      status: videoRes.status,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Stream Error:', error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}