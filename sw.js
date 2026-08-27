// ═══════════════════════════════════════════════════════════════
// САМОУНИЧТОЖАЮЩИЙСЯ Service Worker.
// Старый SW (stale-while-revalidate) застревал в median WebView и держал
// устаревший кеш index.html (белый экран, версия не обновлялась).
// Этот SW при активации удаляет все кеши, отрегистрирует себя и
// перезагружает страницу — после чего игра грузится напрямую из сети.
// Браузер проверяет sw.js в сети при каждой регистрации, поэтому этот
// «kill switch» доходит даже до тех, у кого index.html застрял.
// ═══════════════════════════════════════════════════════════════
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 1. Удаляем все кеши
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (e) {}
    // 2. Отрегистрируем сам себя
    try { await self.registration.unregister(); } catch (e) {}
    // 3. Перезагружаем открытые вкладки — теперь загрузятся свежими из сети
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(c => c.navigate(c.url));
    } catch (e) {}
  })());
});

// fetch НЕ перехватываем — все запросы идут напрямую в сеть.
