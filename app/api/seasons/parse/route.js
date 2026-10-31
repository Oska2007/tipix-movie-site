import { NextResponse } from 'next/server';
import { buildEpisodeList } from '@/lib/episodeParser';

export const maxDuration = 60;

const RD_API = 'https://api.real-debrid.com/rest/1.0';
const RD_TOKEN = process.env.REAL_DEBRID_API_KEY;

export async function POST(req) {
  try {
    const { magnet } = await req.json();
    if (!magnet || !magnet.startsWith('magnet:')) {
      return NextResponse.json({ error: 'Invalid magnet link' }, { status: 400 });
    }

    if (!RD_TOKEN) {
      return NextResponse.json({ error: 'Real-Debrid API Key is missing' }, { status: 500 });
    }

    // 1. Real-Debrid එකට ටොරන්ට් එක එකතු කරනවා
    const addRes = await fetch(`${RD_API}/torrents/addMagnet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RD_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ magnet }),
    });

    const addData = await addRes.json();
    if (!addRes.ok) throw new Error(addData.error || 'Failed to add magnet to Real-Debrid');

    const torrentId = addData.id;

    // 2. Real-Debrid එකෙන් විස්තර එනකන් පොඩි වෙලාවක් ඉන්නවා (2s)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const infoRes = await fetch(`${RD_API}/torrents/info/${torrentId}`, {
      headers: { 'Authorization': `Bearer ${RD_TOKEN}` },
    });
    
    const info = await infoRes.json();
    
    if (!info.files || info.files.length === 0) {
      throw new Error('No files found in this torrent yet. Real-Debrid is still loading it.');
    }

    // 3. අපේ සයිට් එකට ගැළපෙන විදිහට ෆයිල්ස් ලිස්ට් එක හදනවා
    const files = info.files.map((f, i) => ({
      index: i,
      name: f.path,
      size: f.bytes,
    }));

    const parsedEpisodes = buildEpisodeList(files);

    return NextResponse.json({
      infoHash: info.hash,
      name: info.filename,
      totalFiles: files.length,
      episodes: parsedEpisodes,
      rawFiles: files,
    });

  } catch (err) {
    return NextResponse.json({ error: err.message || 'Parse failed' }, { status: 500 });
  }
}