import { useCallback, useEffect, useState } from 'react';

const PREFS_KEY = 'school_cal_notif_prefs';

const DEFAULT_PREFS = {
  enabled: false,
  categories: ['academic', 'exam', 'activity', 'holiday', 'vacation', 'fee', 'ptm'],
  advanceDays: [1],
};

const loadPrefs = () => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
};

const savePrefs = (prefs) => localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));

const getFireTime = (eventDate, advanceDays) => {
  const d = new Date(eventDate);
  d.setDate(d.getDate() - advanceDays);
  d.setHours(8, 0, 0, 0);
  return d.getTime();
};

const bodyText = (advanceDays, dateStr) => {
  if (advanceDays === 0) return `Today — ${dateStr}`;
  if (advanceDays === 1) return `Tomorrow — ${dateStr}`;
  return `In ${advanceDays} days — ${dateStr}`;
};

let swReg = null;

const registerSW = async () => {
  if (!('serviceWorker' in navigator)) return null;
  if (swReg) return swReg;
  swReg = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;
  return swReg;
};

const scheduleAll = async (events, prefs) => {
  const reg = await registerSW();
  if (!reg?.active) return;

  reg.active.postMessage({ type: 'CLEAR_ALL' });

  if (!prefs.enabled) return;

  const now = Date.now();
  events.forEach((event) => {
    if (!prefs.categories.includes(event.category)) return;
    prefs.advanceDays.forEach((days) => {
      const fireAt = getFireTime(event.date, days);
      if (fireAt <= now) return;
      const tag = `event-${event.id}-${days}`;
      const dateStr = new Date(event.date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short',
      });
      reg.active.postMessage({
        type: 'SCHEDULE',
        tag,
        title: event.title,
        body: bodyText(days, dateStr),
        fireAt,
      });
    });
  });
};

export const useNotifications = (events) => {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [permissionStatus, setPermissionStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    if (prefs.enabled && permissionStatus === 'granted') {
      scheduleAll(events, prefs);
    }
  }, [events, prefs, permissionStatus]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermissionStatus(result);
    if (result === 'granted') {
      const newPrefs = { ...prefs, enabled: true };
      setPrefs(newPrefs);
      savePrefs(newPrefs);
    }
  }, [prefs]);

  const updatePrefs = useCallback((updates) => {
    const newPrefs = { ...prefs, ...updates };
    setPrefs(newPrefs);
    savePrefs(newPrefs);
  }, [prefs]);

  return { prefs, updatePrefs, permissionStatus, requestPermission };
};
