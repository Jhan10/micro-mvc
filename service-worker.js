importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst()
);

/* self.addEventListener('push', (event) =>{
    let notification = event.data.json();
    self.registration.showNotification(
        notification.title,
        notification.options
    )
}) */