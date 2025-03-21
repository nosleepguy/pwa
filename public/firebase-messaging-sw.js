// Import Firebase libraries using importScripts (using compat versions)
importScripts(
  "https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCq8Y2phooUn0KOfjhHH6BL6rH6bcmhXUg",
  authDomain: "pwa-noti-102c5.firebaseapp.com",
  projectId: "pwa-noti-102c5",
  storageBucket: "pwa-noti-102c5.firebasestorage.app",
  messagingSenderId: "96369261921",
  appId: "1:96369261921:web:230c01d935ce26740a1920"
};

// Initialize the Firebase App
firebase.initializeApp(firebaseConfig);

// IMPORTANT: Call firebase.messaging() with no argument!
const messaging = firebase.messaging();

// (Optional) Listen for background messages.
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vite.svg", // Update the icon path as needed
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
