// public/sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // දැනට අපි කිසිම දෙයක් Cache කරන්නේ නෑ. නිකන්ම ඉන්නවා.
});