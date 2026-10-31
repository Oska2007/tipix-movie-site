const EXTRA_TRACKERS = [
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://open.stealth.si:80/announce',
  'udp://tracker.torrent.eu.org:451/announce',
  'udp://tracker.bittor.pw:1337/announce',
  'udp://tracker.openbittorrent.com:6969/announce',
  'udp://exodus.desync.com:6969/announce',
  'udp://tracker.dler.org:6969/announce',
  'udp://explodie.org:6969/announce',
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.btorrent.xyz',
  'wss://tracker.webtorrent.dev',
  'wss://tracker.files.fm:7073/announce'
];

function appendTrackers(magnet) {
  const extras = EXTRA_TRACKERS
    .filter(t => !magnet.includes(encodeURIComponent(t)))
    .map(t => `&tr=${encodeURIComponent(t)}`)
    .join('');
  return magnet + extras;
}

export async function parseMagnet(magnetUrl, timeoutMs = 15000) { // Timeout එක 15s ට අඩු කළා
  const { default: WebTorrent } = await import('webtorrent');

  return new Promise((resolve, reject) => {
    const client = new WebTorrent({ dht: true, tracker: true });
    let resolved = false;

    const cleanup = () => {
      try { client.destroy(); } catch {}
    };

    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(new Error('Timeout: Torrent metadata not found. The torrent might be dead or has no seeders.'));
    }, timeoutMs);

    try {
      const finalMagnet = appendTrackers(magnetUrl);
      const torrent = client.add(finalMagnet);

      torrent.on('metadata', () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);

        const files = torrent.files.map((f, i) => ({
          index: i,
          name: f.name,
          size: f.length,
        }));

        const result = {
          infoHash: torrent.infoHash,
          name: torrent.name,
          files,
        };

        cleanup();
        resolve(result);
      });

      client.on('error', (err) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        cleanup();
        reject(err);
      });
    } catch (e) {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      cleanup();
      reject(e);
    }
  });
}