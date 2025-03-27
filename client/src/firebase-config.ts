import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// export const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FILEBASE_KEY,
//   authDomain: "pwa-noti-102c5.firebaseapp.com",
//   projectId: "pwa-noti-102c5",
//   storageBucket: "pwa-noti-102c5.firebasestorage.app",
//   messagingSenderId: "96369261921",
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyCq8Y2phooUn0KOfjhHH6BL6rH6bcmhXUg",
  authDomain: "pwa-noti-102c5.firebaseapp.com",
  projectId: "pwa-noti-102c5",
  storageBucket: "pwa-noti-102c5.firebasestorage.app",
  messagingSenderId: "96369261921",
  appId: "1:96369261921:web:230c01d935ce26740a1920"
};

export const VITE_FIREBASE_VALID_KEY = import.meta.env.VITE_FIREBASE_VALID_KEY;

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, getToken, messaging, onMessage };
