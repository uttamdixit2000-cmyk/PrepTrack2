/* PrepTrack by UD — offline cache. Network-first for index, cache-first for static files. */
const VERSION = 'preptrack-v1.4.1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css',
  './js/core.js', './js/exams.js', './js/data-tables.js', './js/data-gk.js', './js/data-english.js',
  './js/gen-quant.js', './js/gen-reason.js', './js/gen-lang.js', './js/charts.js', './js/practice.js', './js/cards.js',
  './js/data-states.js', './js/data-world.js', './js/data-orgs.js', './js/data-mains.js', './js/data-hi.js', './js/data-hi-world.js', './js/maps.js',
  './icons/icon-48.png', './icons/icon-72.png', './icons/icon-96.png', './icons/icon-144.png',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-192.png', './icons/maskable-512.png', './icons/notif-96.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(async (c) => {
    await c.addAll(ASSETS);
    try { // offline maps: every file listed in maps/manifest.json is saved for offline use
      const list = await (await fetch('./maps/manifest.json', { cache: 'no-store' })).json();
      if (Array.isArray(list) && list.length) await c.addAll(list.map((p) => './' + p));
    } catch (err) { /* no maps added yet */ }
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // only cache our own files
  if (url.pathname.endsWith('/feed.json')) { // daily news: always try the network first so a sync is never hidden by cache
    e.respondWith(fetch(req).then((res) => { if (res && res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone())); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((cs) => (cs.length ? cs[0].focus() : self.clients.openWindow('./index.html'))));
});
