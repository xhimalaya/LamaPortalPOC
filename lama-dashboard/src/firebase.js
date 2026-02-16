// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCl7G5TyQ4HQz_jdzuzwUO4UzDoO3xp0YI",
  authDomain: "lama-dashboard-pwa03.firebaseapp.com",
  projectId: "lama-dashboard-pwa03",
  storageBucket: "lama-dashboard-pwa03.firebasestorage.app",
  messagingSenderId: "764915289747",
  appId: "1:764915289747:web:0313d17e84cd802f15c766"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);