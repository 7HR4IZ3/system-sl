// Service Worker for PWA functionality

const CACHE_NAME = "levelup-v1";
const OFFLINE_URL = "/offline";

// Assets to cache on install
const ASSETS_TO_CACHE = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-maskable-192x192.png",
  "/icons/icon-maskable-512x512.png",
];

// Install event - cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip browser-sync requests
  if (event.request.url.includes("browser-sync")) {
    return;
  }

  // Handle API requests differently - network first, then offline response
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: "You are offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      })
    );
    return;
  }

  // For page navigations - network first with cache fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // For assets - stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Update cache with fresh response
          if (networkResponse.ok) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Return offline fallback if network fails and no cache
          if (event.request.destination === "image") {
            return new Response(
              '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#eee"/><text x="200" y="150" font-family="Arial" font-size="20" text-anchor="middle" fill="#999">Image Unavailable</text></svg>',
              {
                headers: { "Content-Type": "image/svg+xml" },
              }
            );
          }
          return new Response("Content not available offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        });

      // Return cached response if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-offline-data") {
    event.waitUntil(syncOfflineData());
  }
});

// Function to sync offline data
async function syncOfflineData() {
  try {
    const offlineData = await getOfflineData();

    if (Object.values(offlineData).some((arr) => arr.length > 0)) {
      const response = await fetch("/api/cron/pwa-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: offlineData }),
      });

      if (response.ok) {
        // Clear offline data after successful sync
        await clearOfflineData();
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Background sync failed:", error);
    return false;
  }
}

// Helper function to get offline data from IndexedDB
async function getOfflineData() {
  // This is a simplified version - in a real app, use IndexedDB
  return {
    taskCompletions: [],
    habitCompletions: [],
    goalUpdates: [],
  };
}

// Helper function to clear offline data
async function clearOfflineData() {
  // This is a simplified version - in a real app, use IndexedDB
}

// Push notification event
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      data: {
        url: data.url || "/",
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (error) {
    console.error("Push notification error:", error);
  }
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      const url = event.notification.data.url;

      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }

      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
