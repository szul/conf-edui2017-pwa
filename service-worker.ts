/// <reference path="./static/ts/types.ts" />

var cacheName = "CACHE-1";

var files = [
    "./index.html"
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
                  return response;
              });
          }
      })
    );
});
