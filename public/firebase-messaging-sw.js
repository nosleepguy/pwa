//public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

self.addEventListener('fetch', () => {
  const urlParams = new URLSearchParams(location.search);
  self.firebaseConfig = Object.fromEntries(urlParams);
});

const defaultConfig = {
  apiKey: "AIzaSyCq8Y2phooUn0KOfjhHH6BL6rH6bcmhXUg",
  authDomain: "pwa-noti-102c5.firebaseapp.com",
  projectId: "pwa-noti-102c5",
  storageBucket: "pwa-noti-102c5.firebasestorage.app",
  messagingSenderId: "96369261921",
  appId: "1:96369261921:web:230c01d935ce26740a1920"
};

firebase.initializeApp(self.firebaseConfig || defaultConfig);

if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(function(payload) {
    console.log("Received background message ", payload);
 
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
 
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
 
}
