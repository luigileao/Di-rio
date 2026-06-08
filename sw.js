// sw.js — Meu Diário PWA v5.0
const CACHE = 'diario-v8-0';
const SHELL = ['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
const IGNORE = ['supabase.co','supabase.in','googleapis.com','gstatic.com','openstreetmap.org','nominatim','unpkg.com','tile.openstreetmap','tesseract'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });

const notifTimers = {};
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'SKIP_WAITING') return self.skipWaiting();
  if (d.type === 'SCHEDULE_NOTIF') {
    const delay = d.when - Date.now();
    if (delay <= 0 || delay > 2147483647) return;
    clearTimeout(notifTimers[d.id]);
    notifTimers[d.id] = setTimeout(() => {
      self.registration.showNotification(d.title || '🔔 Lembrete', { body: d.body || '', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: d.id, vibrate: [200,100,200] });
    }, delay);
  }
});
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(clients.matchAll({type:'window'}).then(list => { for (const c of list) if ('focus' in c) return c.focus(); if (clients.openWindow) return clients.openWindow('./'); })); });
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (IGNORE.some(d => url.includes(d))) return;
  if (e.request.method !== 'GET') return;
  if (!url.startsWith('http')) return;
  e.respondWith(fetch(e.request).then(res => { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{}); return res; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
