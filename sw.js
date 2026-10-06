/* Service worker del sito ASD Ponte agli Stolli.
   Strategia "prima la rete": quando sei online ricevi sempre la versione aggiornata del sito;
   se sei offline o la connessione e' debole, il sito si apre da una copia salvata. */
const CACHE = "pas-v1";
const BASE = [
  "./", "index.html", "classifica.html", "marcatori.html", "calendario.html", "risultati.html", "rosa.html", "staff.html", "sponsor.html",
  "assets/css/style.css", "assets/css/fx.css", "assets/css/fx2.css",
  "assets/js/data.js", "assets/js/main.js", "assets/js/fx.js", "assets/js/fx2.js",
  "assets/img/logo.png", "assets/fonts/montserrat-latin.woff2", "assets/fonts/bebas-neue-latin.woff2",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(chiavi => Promise.all(chiavi.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: "no-cache" })
      .then(res => {
        if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || (req.mode === "navigate" ? caches.match("index.html") : undefined)))
  );
});
