/* UNITE Friend Challenge — service worker (app-shell offline cache) */
var CACHE_NAME = "ufc-cache-v19";
var PRECACHE = [
  "./index.html",
  "./testimony.html",
  "./types.html",
  "./guidelines.html",
  "./privacy.html",
  "./about.html",
  "./donate.html",
  "./start.html",
  "./quiz.html",
  "./result.html",
  "./challenge.html",
  "./resources.html",
  "./group.html",
  "./admin/index.html",
  "./admin/groups.html",
  "./admin/export.html",
  "./manifest.webmanifest",
  "./assets/css/style.css",
  "./assets/js/data.js",
  "./assets/js/config.js",
  "./assets/js/fx.js",
  "./assets/js/types.js",
  "./assets/images/hero.jpg",
  "./assets/js/characters.js",
  "./assets/js/nav.js",
  "./assets/js/register.js",
  "./assets/js/quiz.js",
  "./assets/js/result.js",
  "./assets/js/challenge.js",
  "./assets/js/resources.js",
  "./assets/js/testimony.js",
  "./assets/js/group.js",
  "./assets/js/admin.js",
  "./assets/js/admin-groups.js",
  "./assets/js/admin-export.js",
  "./assets/icons/icon.svg",
  "./assets/icons/icon-maskable.svg",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var network = fetch(event.request)
        .then(function (response) {
          if (response && response.status === 200 && response.type === "basic") {
            var copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
          }
          return response;
        })
        .catch(function () { return cached; });
      return cached || network;
    })
  );
});
