export function parseEpisodeInfo(filename) {
  const base = filename.split(/[\/\\]/).pop() || filename;
  const name = base.replace(/\.(mp4|mkv|avi|webm|m4v|mov|flv|wmv|ts)$/i, '');

  let m = name.match(/[Ss](\d{1,2})[.\s_-]*[Ee](\d{1,4})/);
  if (m) return { season: +m[1], episode: +m[2], title: cleanTitle(name) };

  m = name.match(/\b(\d{1,2})x(\d{1,4})\b/);
  if (m) return { season: +m[1], episode: +m[2], title: cleanTitle(name) };

  m = name.match(/(?:episode|ep)[.\s_-]*(\d{1,4})/i);
  if (m) return { season: null, episode: +m[1], title: cleanTitle(name) };

  m = name.match(/(?:^|\s)(\d{1,4})$/);
  if (m) return { season: null, episode: +m[1], title: cleanTitle(name) };

  return { season: null, episode: null, title: cleanTitle(name) };
}

function cleanTitle(name) {
  return name
    .replace(/[._]/g, ' ')
    .replace(/\b(1080p|720p|480p|2160p|4K|BluRay|BRRip|WEB-DL|WEBRip|x264|x265|HEVC|AAC|DTS|HDTV|HDR)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isVideoFile(filename) {
  return /\.(mp4|webm|mkv|m4v|mov|avi|ts)$/i.test(filename);
}

export function buildEpisodeList(files) {
  const episodes = files
    .filter(f => isVideoFile(f.name))
    .map(f => {
      const parsed = parseEpisodeInfo(f.name);
      return {
        fileIndex: f.index,
        fileName: f.name,
        size: f.size,
        season: parsed.season,
        episode: parsed.episode,
        title: parsed.title,
      };
    });

  episodes.sort((a, b) => {
    if (a.season !== b.season) return (a.season || 0) - (b.season || 0);
    return (a.episode || 0) - (b.episode || 0);
  });

  episodes.forEach((ep, i) => {
    if (ep.episode == null) ep.episode = i + 1;
  });

  return episodes;
}