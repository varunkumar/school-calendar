const DB_NAME = 'school_cal_notifs';
const STORE_NAME = 'scheduled';
const CACHE_NAME = 'school-cal-v1';
const OFFLINE_URL = '/';

const openDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME, { keyPath: 'tag' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const saveNotif = async (notif) => {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(notif);
    tx.oncomplete = res;
    tx.onerror = rej;
  });
};

const getAllNotifs = async () => {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = rej;
  });
};

const deleteNotif = async (tag) => {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(tag);
    tx.oncomplete = res;
    tx.onerror = rej;
  });
};

const firePending = async () => {
  const now = Date.now();
  const all = await getAllNotifs();
  for (const n of all) {
    if (n.fireAt <= now) {
      await self.registration.showNotification(n.title, {
        body: n.body,
        icon: '/logo192.png',
        tag: n.tag,
        data: { url: '/' },
      });
      await deleteNotif(n.tag);
    }
  }
};

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([OFFLINE_URL, '/logo-school.png', '/logo192.png', '/favicon.ico'])
        .catch(() => {}) // ignore missing files
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
    ]).then(firePending)
  );
});

self.addEventListener('message', async (e) => {
  if (e.data?.type === 'SCHEDULE') {
    const { title, body, fireAt, tag } = e.data;
    const delay = fireAt - Date.now();
    if (delay <= 0) {
      await self.registration.showNotification(title, {
        body, icon: '/logo192.png', tag, data: { url: '/' },
      });
    } else if (delay < 86400000) {
      setTimeout(async () => {
        await self.registration.showNotification(title, {
          body, icon: '/logo192.png', tag, data: { url: '/' },
        });
      }, delay);
    } else {
      await saveNotif({ tag, title, body, fireAt });
    }
  }

  if (e.data?.type === 'CLEAR_ALL') {
    const all = await getAllNotifs();
    for (const n of all) await deleteNotif(n.tag);
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const focused = clients.find((c) => c.focus);
      if (focused) return focused.focus();
      return self.clients.openWindow('/');
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Only handle GET requests for same-origin or CDN assets
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.ok && (
          e.request.url.includes('/static/') ||
          e.request.url.endsWith('.png') ||
          e.request.url.endsWith('.ico') ||
          e.request.url.endsWith('.json')
        )) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() =>
        // Network failed — serve from cache, fallback to offline page
        caches.match(e.request).then((cached) => cached || caches.match(OFFLINE_URL))
      )
  );
});
