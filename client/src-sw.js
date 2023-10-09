import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { setCacheNameDetails } from 'workbox-core';
import { clientsClaim, skipWaiting } from 'workbox-core';

// Set cache names for different types of assets
setCacheNameDetails({
  prefix: 'my-text-editor',
  suffix: 'v1',
});

// Precache and route your assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache assets using CacheFirst strategy (e.g., styles, scripts, images)
const assetsCache = new CacheFirst({
  cacheName: 'assets-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 7 * 24 * 60 * 60, // Cache assets for 7 days
    }),
  ],
});

// Route for assets using CacheFirst strategy
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
  assetsCache
);

// Cache the page using NetworkFirst strategy
const pageCache = new NetworkFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // Cache pages for 30 days
    }),
  ],
});

registerRoute(({ request }) => request.mode === 'navigate', ({ event }) => {
  try {
    return pageCache.handle({ event });
  } catch (error) {
    return caches.match('/offline.html'); // Show an offline page if navigation fails
  }
});

// Precache the offline page
precacheAndRoute(['/offline.html']);

// Install the service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    skipWaiting() // Activate the new service worker immediately
  );
});

// Activate the service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    clientsClaim() // Take control of all open client pages without waiting for reload
  );
});
