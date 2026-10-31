import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RD_API = 'https://api.real-debrid.com/rest/1.0';
const RD_TOKEN = process.env.REAL_DEBRID_API_KEY;

// Real-Debrid API එකට කනෙක්ට් වෙන Helper Function
async function rdFetch(endpoint, options = {}) {
  if (!RD_TOKEN) throw new Error('Real-Debrid API Key is missing');
  const res = await fetch(`${RD_API}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${RD_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Real-Debrid Error');
  return data;
}

export async function POST(req) {
  try {
    const { magnet } = await req.json();
    if (!magnet) return new NextResponse('Missing magnet', { status: 400 });

    // 1. ටොරන්ට් එක Real-Debrid එකට දානවා
    const addRes = await rdFetch('/torrents/addMagnet', {
      method: 'POST',
      body: new URLSearchParams({ magnet }),
    });
    const torrentId = addRes.id;

    // 2. ෆයිල්ස් ලෝඩ් වෙනකන් ඉන්නවා
    await new Promise(resolve => setTimeout(resolve, 2000));
    const info = await rdFetch(`/torrents/info/${torrentId}`);

    if (!info.files || info.files.length === 0) {
      return new NextResponse('No files found in torrent yet', { status: 404 });
    }

    // 3. ටොරන්ට් එකේ තියෙන .srt ෆයිල්ස් විතරක් ෆිල්ටර් කරනවා
    const srtFiles = info.files.filter(f => f.path.toLowerCase().endsWith('.srt'));

    if (srtFiles.length === 0) {
      return new NextResponse('No .srt subtitles found in this torrent', { status: 404 });
    }

    // 4. ලොකුම හෝ පළවෙනි SRT එක තෝරගන්නවා (එකක් තියෙන්න පුළුවන් නිසා)
    // Real-Debrid එකේ ෆයිල්ස් ටික තෝරන්න ඕනේ (selectFiles)
    const fileId = srtFiles[0].id;
    await rdFetch(`/torrents/selectFiles/${torrentId}`, {
      method: 'POST',
      body: new URLSearchParams({ files: fileId.toString() }),
    });

    // තෝරපු එකේ ලින්ක් එක එනකන් ඉන්නවා
    await new Promise(resolve => setTimeout(resolve, 2000));
    const updatedInfo = await rdFetch(`/torrents/info/${torrentId}`);

    if (updatedInfo.status !== 'downloaded' || !updatedInfo.links || updatedInfo.links.length === 0) {
       return new NextResponse('Subtitle file is not ready yet. Please try again in a minute.', { status: 202 });
    }

    // 5. ඒ ලින්ක් එක Unrestrict කරලා Direct ලින්ක් එක ගන්නවා
    const downloadLink = updatedInfo.links[0];
    const unrestrictRes = await rdFetch('/unrestrict/link', {
      method: 'POST',
      body: new URLSearchParams({ link: downloadLink }),
    });

    // 6. අපි ඒ Direct ලින්ක් එකට කෙලින්ම Fetch කරලා බ්‍රව්සර් එකට යවනවා (ඩවුන්ලෝඩ් වෙන්න)
    const srtResponse = await fetch(unrestrictRes.download);
    const srtText = await srtResponse.text();

    return new NextResponse(srtText, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-subrip',
        'Content-Disposition': `attachment; filename="${srtFiles[0].path.split('/').pop()}"`,
      },
    });

  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}