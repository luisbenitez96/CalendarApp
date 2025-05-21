importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

workbox.loadModule("workbox-background-sync");

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;
const { BackgroundSyncPlugin } = workbox.backgroundSync;

const cacheNetworkFirst = ["/api/events", "/api/auth/renew"];

registerRoute(({ request, url }) => {
  // console.log({ request, url });

  if (cacheNetworkFirst.includes(url.pathname)) return true;

  return false;
}, new NetworkFirst());

const cacheFirstNetwork = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.csss",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-solid-900.woff2",
];
registerRoute(({ request, url }) => {
  // console.log({ request, url });

  if (cacheFirstNetwork.includes(url.href)) return true;

  return false;
}, new CacheFirst());

// registerRoute(
//   new RegExp(
//     "https://react-mern-backend-production-644b.up.railway.app/api/events"
//   ),
//   new NetworkFirst()
// );
// registerRoute(
//   new RegExp(
//     "https://react-mern-backend-production-644b.up.railway.app/api/auth/renew"
//   ),
//   new NetworkFirst()
// ),
// registerRoute(
//   new RegExp(
//     "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.csss"
//   ),
//   new CacheFirst()
// ),
//   registerRoute(
//     new RegExp(
//       "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
//     ),
//     new CacheFirst()
//   );

const bgSyncPlugin = new BackgroundSyncPlugin("post-offline", {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
});

const logPlugin = {
  fetchDidFail: async ({ request }) => {
    console.log("Fallo en la petición:", request.method, request.url);
  },
  handlerDidStart: async ({ request }) => {
    console.log("Interceptada:", request.method, request.url);
  },
};

registerRoute(
  new RegExp(
    "https://react-mern-backend-production-644b.up.railway.app/api/events"
  ),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST"
);

registerRoute(
  new RegExp(
    "https://react-mern-backend-production-644b.up.railway.app/api/events/.*"
  ),
  new NetworkOnly({
    plugins: [bgSyncPlugin, logPlugin],
  }),
  "DELETE"
);

registerRoute(
  new RegExp(
    "https://react-mern-backend-production-644b.up.railway.app/api/events/.*"
  ),
  new NetworkOnly({
    plugins: [bgSyncPlugin, logPlugin],
  }),
  "PUT"
);
