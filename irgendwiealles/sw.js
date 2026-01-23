// sw.js - Service Worker für Minecraft Spielzeiten
const CACHE_NAME = 'minecraft-times-v6';
const CACHE_FILES = [
  './',
  './indexx.html',
  './players.json',
  './manifest.json'
];

// Installieren
self.addEventListener('install', event => {
  console.log('[Service Worker] Installiere...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching Dateien');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('[Service Worker] Installation abgeschlossen');
        return self.skipWaiting();
      })
  );
});

// Aktivieren
self.addEventListener('activate', event => {
  console.log('[Service Worker] Aktiviere...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Lösche alten Cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Aktivierung abgeschlossen');
      return self.clients.claim();
    })
  );
});

// Fetch Handler - NUR für lokale Dateien
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // NUR lokale Dateien cachen, externe URLs direkt fetchen
  if (url.origin !== self.location.origin) {
    // Externe URLs (api.mojang.com, crafatar.com) direkt fetchen, nicht cachen
    return;
  }
  
  // Nur GET-Anfragen für lokale Dateien behandeln
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit
        if (response) {
          // Im Hintergrund aktualisieren
          fetch(event.request)
            .then(networkResponse => {
              if (networkResponse.ok) {
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {
              // Fehler ignorieren
            });
          return response;
        }
        
        // Cache miss
        return fetch(event.request)
          .then(networkResponse => {
            // Erfolgreiche Antworten cachen
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return networkResponse;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch fehlgeschlagen:', error);
            // Fallback für index.html
            if (event.request.mode === 'navigate') {
              return caches.match('./');
            }
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Push-Benachrichtigungen
self.addEventListener('push', event => {
  console.log('[Service Worker] Push-Benachrichtigung empfangen');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Minecraft Spielzeiten',
        body: 'Spielzeit-Erinnerung'
      };
    }
  }
  
  const options = {
    body: data.body || 'Spielzeit-Erinnerung',
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732238.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/732/732238.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || './'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Minecraft Spielzeiten', options)
  );
});

// Benachrichtigung angeklickt
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Benachrichtigung angeklickt');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // Bereits geöffnetes Fenster fokussieren
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Neues Fenster öffnen
        if (clients.openWindow) {
          return clients.openWindow('./');
        }
      })
  );
});
