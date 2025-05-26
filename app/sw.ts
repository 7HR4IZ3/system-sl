export default function registerServiceWorker() {
  if (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    window.workbox !== undefined
  ) {
    const sw = "/service-worker.js";

    navigator.serviceWorker
      .register(sw)
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }
}
