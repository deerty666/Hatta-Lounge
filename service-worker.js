self.addEventListener("install",e=>{
e.waitUntil(
caches.open("app-v3").then(cache=>{
return cache.addAll([
"./",
"./index.html",
"./style.css",
"./script.js",
"./logo.png"
]);
})
);
});

self.addEventListener("fetch",e=>{
e.respondWith(
caches.match(e.request).then(res=>res||fetch(e.request))
);
});
