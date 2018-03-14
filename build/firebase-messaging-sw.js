// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://unoflow-8ec7e.firebaseapp.com/__/firebase/4.8.1/firebase-app.js');
importScripts('https://unoflow-8ec7e.firebaseapp.com/__/firebase/4.8.1/firebase-messaging.js');
importScripts('https://unoflow-8ec7e.firebaseapp.com/__/firebase/init.js');

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

