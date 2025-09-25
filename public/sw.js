// Service Worker pour Ebo'o Gest - Fonctionnement Offline
const CACHE_NAME = 'ebo-gest-v1';
const OFFLINE_URL = '/offline.html';

// Ressources à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-ebo-gest.png',
  '/offline.html'
];

// Installer le Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Mise en cache des ressources statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation terminée');
        return self.skipWaiting();
      })
  );
});

// Activer le Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation terminée');
      return self.clients.claim();
    })
  );
});

// Intercepter les requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Stratégie pour les API Firebase
  if (url.hostname.includes('firestore.googleapis.com') || 
      url.hostname.includes('firebase.googleapis.com')) {
    event.respondWith(handleFirebaseRequest(request));
    return;
  }

  // Stratégie pour les ressources statiques
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'image') {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Stratégie par défaut: Network First
  event.respondWith(handleDefaultRequest(request));
});

// Gérer les requêtes Firebase (Cache First avec fallback réseau)
async function handleFirebaseRequest(request) {
  try {
    // Essayer le réseau en premier pour les données Firebase
    const networkResponse = await fetch(request);
    
    // Ne pas mettre en cache les requêtes POST, PUT, DELETE, HEAD
    if (networkResponse.ok && ['GET', 'OPTIONS'].includes(request.method)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📴 Service Worker: Réseau indisponible, utilisation du cache');
    
    // Fallback sur le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si pas de cache et hors ligne, retourner une réponse d'erreur
    return new Response(
      JSON.stringify({ 
        error: 'Données non disponibles hors ligne',
        offline: true 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Gérer les ressources statiques (Cache First)
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Si c'est une requête de document et qu'on est hors ligne
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// Gérer les requêtes par défaut (Network First)
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Ne pas mettre en cache les requêtes POST, PUT, DELETE, HEAD
    if (networkResponse.ok && ['GET', 'OPTIONS'].includes(request.method)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Gérer les messages du client
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearCache().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'CACHE_DATA':
      cacheData(payload).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

// Background Sync pour les données hors ligne
self.addEventListener('sync', (event) => {
  if (event.tag === 'offline-sync') {
    console.log('🔄 Service Worker: Background Sync déclenché');
    event.waitUntil(syncOfflineData());
  }
});

// Fonction de synchronisation des données hors ligne
async function syncOfflineData() {
  try {
    // Récupérer les données en attente depuis IndexedDB
    const pendingData = await getPendingData();
    
    for (const item of pendingData) {
      try {
        await syncDataItem(item);
        await removePendingData(item.id);
      } catch (error) {
        console.error('❌ Erreur sync item:', error);
      }
    }
    
    console.log('✅ Service Worker: Synchronisation terminée');
  } catch (error) {
    console.error('❌ Erreur sync globale:', error);
  }
}

// Obtenir le statut du cache
async function getCacheStatus() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  
  return {
    cacheName: CACHE_NAME,
    cachedItems: keys.length,
    cacheSize: await getCacheSize(cache)
  };
}

// Calculer la taille du cache
async function getCacheSize(cache) {
  const keys = await cache.keys();
  let totalSize = 0;
  
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const blob = await response.blob();
      totalSize += blob.size;
    }
  }
  
  return totalSize;
}

// Vider le cache
async function clearCache() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Mettre en cache des données spécifiques
async function cacheData(data) {
  const cache = await caches.open(CACHE_NAME);
  
  for (const [url, content] of Object.entries(data)) {
    const response = new Response(JSON.stringify(content), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(url, response);
  }
}

// Simuler la récupération des données en attente
async function getPendingData() {
  // Cette fonction devrait interagir avec IndexedDB
  // Pour l'instant, on retourne un tableau vide
  return [];
}

// Simuler la synchronisation d'un élément
async function syncDataItem(item) {
  // Cette fonction devrait envoyer les données à Firebase
  console.log('📤 Sync item:', item);
}

// Simuler la suppression des données synchronisées
async function removePendingData(id) {
  // Cette fonction devrait supprimer l'élément d'IndexedDB
  console.log('🗑️ Remove pending data:', id);
}

// Notification de mise à jour disponible
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          payload: { version: event.data.version }
        });
      });
    });
  }
});

console.log('🚀 Service Worker Ebo\'o Gest chargé et prêt');