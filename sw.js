const CACHE_NAME = 'geolearn-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/components.css',
  './css/map.css',
  './css/mobile.css',
  './js/config.js',
  './js/app.js',
  './js/data/countries.js',
  './js/data/countryDetails.js',
  './js/data/cultureFacts.js',
  './js/modules/i18n.js',
  './js/modules/router.js',
  './js/modules/ui.js',
  './js/modules/flagList.js',
  './js/modules/quizEngine.js',
  './js/modules/quizFlags.js',
  './js/modules/quizCapitals.js',
  './js/modules/worldMap.js',
  './js/modules/quizMap.js',
  './js/modules/quizNightmare.js',
  './js/modules/quizUltimate.js',
  './js/modules/quizCulture.js',
  './js/modules/profile.js',
  './js/modules/achievements.js',
  './js/modules/rankBadges.js',
  './js/modules/leaderboard.js',
  './js/modules/challenge.js',
  './js/modules/groupChallenge.js',
  './js/modules/auth.js',
  './js/modules/flagTest.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })))
        .catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Always network for Supabase API
  if (url.hostname.includes('supabase.co')) return;

  // Network-first then cache for CDN resources (D3, topojson, flag-icons)
  const isCDN = url.hostname.includes('cdn.jsdelivr.net') ||
                url.hostname.includes('unpkg.com') ||
                url.hostname.includes('cdnjs.cloudflare.com') ||
                url.hostname.includes('d3js.org') ||
                url.hostname.includes('fonts.googleapis.com') ||
                url.hostname.includes('fonts.gstatic.com');

  if (isCDN) {
    event.respondWith(
      fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for app shell
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
