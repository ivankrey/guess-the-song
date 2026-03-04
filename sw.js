const CACHE_NAME = 'guess-the-song-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Для работы приложения нужен интернет', {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    })
  );
});
