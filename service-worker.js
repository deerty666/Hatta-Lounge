self.addEventListener('install', event => {
  self.skipWaiting(); // 🔥 يحدث فوراً
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // 🔥 يطبق التحديث مباشرة
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request, { cache: "no-store" }) // 🔥 بدون كاش
      .catch(() => caches.match(event.request))
  );
});
