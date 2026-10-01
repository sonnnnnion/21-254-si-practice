/* 21-254 Practice Lab: offline support.
   The page and the problem data are network-first: always fresh when online, the saved copy when
   offline. MathJax, icons and fonts come from the saved copy and refresh in the background.
   Anything else (the anonymous usage counter) goes straight to the network.
   Bump VERSION when the CORE list changes. */
const VERSION = "pl254-v1";
const CORE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "vendor/mathjax/tex-svg.js",
  "vendor/mathjax/input/tex/extensions/color.js",
  "data/21-254_section01_vectors_matrices_transposes.json",
  "data/21-254_section02_linear_systems_rref_rank_nullspace.json",
  "data/21-254_section03_subspaces_span_li_bases_spaces.json",
  "data/21-254_section04_linear_transformations_determinants_inverses.json",
  "data/21-254_section05_eigenvalues_eigenvectors_multiplicity_eigenbases_complex.json",
  "data/21-254_section06_diagonalization_projections_components_cross_product.json",
  "data/21-254_section07_curves_scalar_functions_partials_gradients_optimization.json",
  "data/21-254_section08_vector_fields_divergence_curl_line_integrals_path_independence.json",
  "data/21-254_section09_double_integrals_change_variables_greens_theorem.json",
  "data/section10_surfaces_stokes_triples.json"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("pl254-") && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// One cache entry per file: drop ?v=, ?qr and friends; every page load is the same app shell
function keyFor(request) {
  const url = new URL(request.url);
  if (request.mode === "navigate") return new URL("./", self.registration.scope).href;
  url.search = ""; url.hash = "";
  return url.href;
}

async function networkFirst(request) {
  const cache = await caches.open(VERSION), key = keyFor(request);
  try {
    // revalidate with the server (a cheap 304 when nothing changed), so a new version shows up right after it's published
    const fresh = request.mode === "navigate" ? new Request(request.url, { cache: "no-cache", credentials: "same-origin" }) : new Request(request, { cache: "no-cache" });
    const response = await fetch(fresh);
    if (response.ok) cache.put(key, response.clone());
    return response;
  } catch (err) {
    const saved = await cache.match(key) || (request.mode === "navigate" && await cache.match("index.html"));
    if (saved) return saved;
    throw err;
  }
}

async function savedFirst(request) {
  const cache = await caches.open(VERSION), key = keyFor(request);
  const saved = await cache.match(key);
  const fresh = fetch(request).then(response => {
    if (response.ok || response.type === "opaque") cache.put(key, response.clone());
    return response;
  }).catch(() => null);
  return saved || (await fresh) || Response.error();
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    const fresh = request.mode === "navigate" || /\.(json|html|webmanifest)$/.test(url.pathname) || url.pathname.endsWith("/");
    event.respondWith(fresh ? networkFirst(request) : savedFirst(request));
  } else if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(savedFirst(request));
  }
});
