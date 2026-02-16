// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Your Firebase config (same as firebaseConfig in firebase.js)
firebase.initializeApp({
  apiKey: "AIzaSyCl7G5TyQ4HQz_jdzuzwUO4UzDoO3xp0YI",
  authDomain: "lama-dashboard-pwa03.firebaseapp.com",
  projectId: "lama-dashboard-pwa03",
  storageBucket: "lama-dashboard-pwa03.firebasestorage.app",
  messagingSenderId: "764915289747",
  appId: "1:764915289747:web:0313d17e84cd802f15c766"
});

const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});