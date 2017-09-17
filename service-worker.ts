/// <reference path="./static/ts/types.ts" />

var cacheName = "CACHE-1";

var files = [
    "./index.html",
    "./static/images/android-icon-36x36.png",
    "./static/images/android-icon-48x48.png",
    "./static/images/android-icon-72x72.png",
    "./static/images/android-icon-96x96.png",
    "./static/images/android-icon-144x144.png",
    "./static/images/android-icon-192x192.png"
];

window.addEventListener(SW.INSTALL, (event) => {
    (<any>event).waitUntil(caches.open(cacheName).then((cache) => {
        return cache.addAll(files).then(() => {
            return (<any>window).skipWaiting();
        }).catch((err) =>  {
            console.error(`Failed to cache: ${err}`);
        });
    }));
});

window.addEventListener(SW.ACTIVATE, (event) => {
    (<any>event).waitUntil(caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cache) => {
            if (cache !== cacheName) {
                return caches.delete(cache);
            }
        }));
      }));
    return (<any>window).clients.claim();
});

window.addEventListener(SW.FETCH, (event) => {
    var request = (<any>event).request;
    (<any>event).respondWith(caches.match(request).then((response) => {
          if (response) {
              return response;
          }
          else {
              return fetch(request).then((response) => {
                    caches.open(cacheName).then((cache) => {
                        cache.put(request, response.clone());                
                        return response;
                    });
              });
          }
      })
    );
});

window.addEventListener(SW.SYNC, function(event) {
    if ((<any>event).tag === "appSync") {
        (<any>event).waitUntil(() => {
            //This should do something and then return a Promise.
        });
    }
});

window.addEventListener(SW.PUSH, function(event) {
    console.log(`Push notification receive. ${(<any>event).data.text()}`);
    var options = {
        body: "Push notification body.",
        icon: "images/icon.png",
        badge: "images/badge.png"
    };
    (<any>event).waitUntil((<any>window).registration.showNotification("Push Notification", options));
});

self.addEventListener(SW.NOTIFICATION_CLICK, function(event) {
    (<any>event).notification.close();
    (<any>event).waitUntil(
        //clients.openWindow("https://codepunk.io")
    );
});
