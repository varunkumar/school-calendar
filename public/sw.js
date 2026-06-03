const DB_NAME = 'school_cal_notifs';
const STORE_NAME = 'scheduled';

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

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim().then(firePending));
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
