// sw.js
const CACHE_NAME = 'offline-hls-cache-v1';
const VIDEO_DB_NAME = 'offlineHLS';
const VIDEO_STORE_NAME = 'segments';

// IndexedDB helper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(VIDEO_DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(VIDEO_STORE_NAME)) {
        db.createObjectStore(VIDEO_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getSegment(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_STORE_NAME, 'readonly');
    const store = tx.objectStore(VIDEO_STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveSegment(key, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_STORE_NAME, 'readwrite');
    const store = tx.objectStore(VIDEO_STORE_NAME);
    const request = store.put(data, key);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

// Install & activate
self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => self.clients.claim());

// Fetch handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith('.m3u8') || url.pathname.endsWith('.ts')) {
    event.respondWith(
      (async () => {
        const tokenParam = url.searchParams.get('token');
        const videoKey = url.pathname + (tokenParam ? `?token=${tokenParam}` : '');
        let cached = await getSegment(videoKey);

        if (cached) {
          return new Response(cached);
        }

        try {
          const response = await fetch(event.request);
          const data = await response.arrayBuffer();
          await saveSegment(videoKey, data);
          return new Response(data);
        } catch (err) {
          console.error('[SW] Fetch failed for:', event.request.url, err);
          return new Response('Offline and no cached version available', { status: 503 });
        }
      })()
    );
  }
});

self.addEventListener('message', async (event) => {
  if (!event.data) return;

  const { type, url, videoId } = event.data;

  if (type === 'PREFETCH_HLS' && url) {
    try {
      console.log('[SW] Prefetch requested:', url);
      const response = await fetch(url);
      const data = await response.arrayBuffer();
      const videoKey = new URL(url).pathname + (new URL(url).search ? new URL(url).search : '');
      await saveSegment(videoKey, data);
      console.log('[SW] Prefetch complete:', videoKey);
    } catch (err) {
      console.error('[SW] Prefetch failed:', url, err);
    }
  }

  if (type === 'DELETE_HLS' && videoId) {
  try {
    const db = await openDB();
    const tx = db.transaction(VIDEO_STORE_NAME, 'readwrite');
    const store = tx.objectStore(VIDEO_STORE_NAME);

    const request = store.getAllKeys();

    request.onsuccess = () => {
      request.result.forEach(key => {
        if (key.includes(`/api/materials/stream/${videoId}/`)) {
          store.delete(key);
          console.log('[SW] Deleted:', key);
        }
      });
    };
  } catch (err) {
    console.error('[SW] Delete failed:', videoId, err);
  }
}

});
