// Service Portal - Service Worker
// Minimal service worker to prevent 404 errors

self.addEventListener('install', function(event) {
    console.log('Service Worker installed');
});

// Removed empty fetch handler to prevent no-op overhead
// During development, we let the browser handle all requests normally 