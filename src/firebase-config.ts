import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FILEBASE_KEY,
  authDomain: "pwa-noti-102c5.firebaseapp.com",
  projectId: "pwa-noti-102c5",
  storageBucket: "pwa-noti-102c5.firebasestorage.app",
  messagingSenderId: "96369261921",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const FIREBASE_VAPID_KEY = import.meta.env.VITE_FIREBASE_VALID_KEY;

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };