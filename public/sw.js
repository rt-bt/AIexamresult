const CACHE = "aier-v2";
const STATIC = ["/", "/manifest.webmanifest", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/")) {
    return event.respondWith(networkFirst(event.request));
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((res) => {
      if (res.ok && res.type === "basic") {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, clone));
      }
      return res;
    }).catch(() => caches.match("/offline")))
  );
});

async function networkFirst(request) {
  try {
    const res = await fetch(request);
    const clone = res.clone();
    caches.open(CACHE).then((cache) => cache.put(request, clone));
    return res;
  } catch {
    return caches.match(request) || new Response(JSON.stringify({ error: "Offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
}
