self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("freelancehub-v1").then(cache =>
      cache.addAll([
        "/index.html",
        "/styles.css",
        "/script.js"
      ])
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
