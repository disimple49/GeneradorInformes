const CACHE_NAME = 'creador-informes-cache-v1';
const urlsToCache = [
    './', // Esto cachea el index.html en la raíz
    './index.html',
    './manifest.json',
    './favicon.ico',
    './icons/android-icon-36x36.png',
    './icons/android-icon-48x48.png',
    './icons/android-icon-72x72.png',
    './icons/android-icon-96x96.png',
    './icons/android-icon-144x144.png',
    './icons/android-icon-192x192.png'
    // Añade aquí cualquier otro icono o asset local que quieras cachear
];

// Instalación del Service Worker: abre la caché y añade los archivos principales.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierta');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Fallo al cachear durante la instalación:', err);
            })
    );
});

// Activación del Service Worker: limpia cachés antiguas.
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento Fetch: sirve los archivos cacheados cuando estén disponibles.
// Para las peticiones al iframe de Apps Script, simplemente las dejará pasar a la red.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // Si no está en caché, ir a la red.
                // Es importante no interferir con las peticiones del iframe de Apps Script.
                return fetch(event.request);
            })
    );
});
