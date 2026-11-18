// Offline-Cache. Bei Änderungen an index.html die Versionsnummer erhöhen.
const V = 'lehrertobi-v23';
// Lesehilfen für den Import (PDF, Excel, Texterkennung) aus dem Netz, nach dem ersten Laden offline
const LIBS = 'lehrertobi-libs';
const LIBHOSTS = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'tessdata.projectnaptha.com'];
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(FILES.map(f => c.add(new Request(f, { cache: 'reload' })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('lehrertobi-') && k !== V && k !== LIBS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Erst Cache (schnell, offline), im Hintergrund aktualisieren.
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (LIBHOSTS.includes(u.hostname)) {
    e.respondWith(caches.open(LIBS).then(async c => (await c.match(r)) || fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; })));
    return;
  }
  if (u.origin !== location.origin) return;
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(r, { ignoreSearch: true });
    const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
