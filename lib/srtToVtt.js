export function srtToVtt(srt) {
  if (!srt) return 'WEBVTT\n\n';
  if (srt.trim().startsWith('WEBVTT')) return srt;

  return 'WEBVTT\n\n' + srt
    .replace(/\r+/g, '')
    .replace(/^\uFEFF/, '')
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
    .trim();
}