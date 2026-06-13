const CACHE_NAME = "aier-v3";
const SW_VERSION = self.location.search?.match(/v=([\d.]+)/)?.[1] || "3.0";

const STATIC_ASSETS = ["/", "/manifest.webmanifest", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // API requests — network first
  if (url.pathname.startsWith("/api/")) {
    return event.respondWith(networkFirst(event.request, 5000));
  }

  // Navigation requests (HTML) — network first
  if (event.request.mode === "navigate") {
    return event.respondWith(networkFirst(event.request));
  }

  // Static assets with content hashes (JS, CSS from Next.js) — cache first
  if (/\.(js|css)\b/.test(url.pathname) && /[a-f0-9]{8,}/.test(url.pathname)) {
    return event.respondWith(cacheFirst(event.request));
  }

  // Other static assets (images, fonts, etc.) — stale while revalidate
  return event.respondWith(staleWhileRevalidate(event.request));
});

async function networkFirst(request, timeout) {
  try {
    const res = await (timeout
      ? Promise.race([
          fetch(request),
          new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), timeout))
        ])
      : fetch(request)
    );
    if (res.ok) {
      const clone = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response("Offline", { status: 503 });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok) {
    const clone = res.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
  }
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then((res) => {
    if (res.ok) cache.put(request, res.clone());
    return res;
  }).catch(() => cached);
  return cached || fetchPromise;
}
