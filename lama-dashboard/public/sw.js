self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('lama-dashboard-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/index-DO3fC-hX.js', // adjust to your actual JS bundle name
        '/assets/index-BvvH-04U.css',
        '/assets/national_emblem2-Dyg0SdhP.png',
        // add other key assets if needed
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});