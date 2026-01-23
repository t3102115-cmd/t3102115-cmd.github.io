// sw.js - Service Worker für /irgendwiealles
const CACHE_NAME = 'mc-times-v1';
const CACHE_FILES = [
  './',
  './index.html',
  './players.json',
  './manifest.json'
];

// Service Worker Installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
  );
});

// Service Worker Aktivierung
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event Handling
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Nur GET-Anfragen
  if (event.request.method !== 'GET') return;
  
  // Für players.json: Network-first
  if (url.pathname.endsWith('players.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Im Cache speichern
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          // Fallback auf Cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Für alle anderen Dateien: Cache-first
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Im Hintergrund aktualisieren
          fetch(event.request)
            .then(response => {
              if (response.ok) {
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, response));
              }
            });
          return cachedResponse;
        }
        
        // Nicht im Cache, normal laden
        return fetch(event.request);
      })
  );
});
