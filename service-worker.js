const CACHE_NAME = "deerty-pos-v3"; // قمنا بتغيير الإصدار لتحديث الذاكرة فورا

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./logo.png",
  "./qr.png",
  "./manifest.json"
];

// 📥 تثبيت التطبيق وحفظ الملفات الأساسية
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// 🧹 تنظيف الإصدارات القديمة من الذاكرة
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ⚡ استراتيجية جلب البيانات الذكية (Network First, Falling Back to Cache)
self.addEventListener("fetch", event => {
  // نقوم بفحص الطلبات العادية فقط (مثل ملفات الصفحات والتصميم)
  if (event.request.method === "GET") {
    event.respondWith(
      // 1️⃣ نحاول أولاً جلب الملف الجديد مباشرة من الإنترنت
      fetch(event.request)
        .then(response => {
          // إذا نجح الاتصال، نضع نسخة محدثة في الذاكرة ونرسل الملف للشاشة
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // 2️⃣ إذا كان الإنترنت ضعيفاً أو مفصولاً، نفتح الذاكرة فوراً ونعرض آخر نسخة محفوظة
          return caches.match(event.request);
        })
    );
  }
});
