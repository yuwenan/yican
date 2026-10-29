/* 一餐 · 离线缓存。改静态资源后 bump CACHE 版本即可整体更新。 */
const CACHE = 'yican-v3';
const ASSETS = [
  './',
  './index.html',
  './theme.css',
  './styles.css',
  './manifest.webmanifest',
  './js/app.js',
  './js/data.js',
  './js/store.js',
  './js/icons.js',
  './js/views.js',
  './assets/img/dish-tomato-egg.png',
  './assets/img/dish-herbs.png',
  './assets/img/kitchen-generic.png',
  './assets/img/cookware.png',
  './assets/icons/icon.svg',
  './assets/icons/icon-maskable.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => { try { c.put(req, copy); } catch (_) {} });
        return res;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
