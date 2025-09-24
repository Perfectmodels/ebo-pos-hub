// Service Worker pour Ebo'o Gest PWA
const CACHE_NAME = 'eboo-gest-v1.0.0';
const STATIC_CACHE = 'eboo-gest-static-v1.0.0';
const DYNAMIC_CACHE = 'eboo-gest-dynamic-v1.0.0';

// Ressources à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-ebo-gest.png',
  '/favicon.ico',
  '/assets/index.css',
  '/assets/index.js'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Mise en cache des ressources statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Erreur lors de l\'installation:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation terminée');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Stratégie Cache First pour les ressources statiques
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Ressource trouvée en cache:', request.url);
            return cachedResponse;
          }
          
          // Si pas en cache, récupérer depuis le réseau
          return fetch(request)
            .then((networkResponse) => {
              // Mettre en cache les réponses réussies
              if (networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return networkResponse;
            })
            .catch(() => {
              // Fallback pour les pages HTML
              if (request.headers.get('accept').includes('text/html')) {
                return caches.match('/index.html');
              }
            });
        })
    );
  }
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('[SW] Notification push reçue');
  
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification d\'Ebo\'o Gest',
    icon: '/logo-ebo-gest.png',
    badge: '/logo-ebo-gest.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ouvrir',
        icon: '/logo-ebo-gest.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/logo-ebo-gest.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Ebo\'o Gest', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clic sur notification:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('[SW] Synchronisation en arrière-plan:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Ici vous pouvez ajouter la logique de synchronisation
      // Par exemple, synchroniser les données avec le serveur
      Promise.resolve()
    );
  }
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  console.log('[SW] Message reçu:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Gestion des erreurs
self.addEventListener('error', (event) => {
  console.error('[SW] Erreur:', event.error);
});

// Gestion des promesses rejetées
self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Promesse rejetée:', event.reason);
});
