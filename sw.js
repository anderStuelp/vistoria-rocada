// Service worker do Vistoria de Roçada: deixa o app abrir sem sinal depois do primeiro acesso.
const CACHE = "vistoria-rocada-v1";
const LOCAL = ["./", "index.html", "data/areas.json", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
const CDN = [
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
  "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500&display=swap"
];
self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(LOCAL);
    await Promise.all(CDN.map(async (u) => { try { await c.put(u, await fetch(u, {mode: "no-cors"})); } catch {} }));
    self.skipWaiting();
  })());
});
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    self.clients.claim();
  })());
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // arquivos do app: rede primeiro (pega atualizações), cache se estiver sem sinal
    e.respondWith((async () => {
      try {
        const r = await fetch(req);
        if (r.ok) { const c = await caches.open(CACHE); c.put(req, r.clone()); }
        return r;
      } catch {
        return (await caches.match(req, {ignoreSearch: true})) || (await caches.match("index.html"));
      }
    })());
  } else if (/cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url.host)) {
    // bibliotecas e fontes: cache primeiro
    e.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      try {
        const r = await fetch(req);
        const c = await caches.open(CACHE); c.put(req, r.clone());
        return r;
      } catch { return hit || Response.error(); }
    })());
  }
});
