const scope = self.registration.scope
const prefix = 'oden-pos:' + scope + ':'
const cacheName = prefix + 'c45dd84a501d48ab'
const files = ["THIRD-PARTY-LICENSES.txt","assets/exceljs.min-En-SfZw2.js","assets/index-ai2eMYzI.js","assets/index-dI2Zrb0A.css","icon-192.png","icon-512.png","icon-maskable.png","icon.svg","index.html","manifest.webmanifest"].map(file => new URL(file, scope).href)
const assets = new Set(files)
const index = new URL('index.html', scope).href

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache =>
    cache.addAll(files.map(url => new Request(url, { cache: 'reload' })))
  ))
})
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName).map(key => caches.delete(key)))
    await self.clients.claim()
  })())
})
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  url.search = ''
  const key = event.request.mode === 'navigate' && (url.href === scope || url.href === index) ? index : url.href
  if (assets.has(key)) event.respondWith((async () => {
    const cache = await caches.open(cacheName)
    return await cache.match(key) ?? fetch(event.request)
  })())
})
