// Firebase Cloud Messaging service worker (background notifications only)

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyDJGvjxRunvADv05o2VHQg--Q-U_kZbUao',
  authDomain: 'pwa-push-demo-5a61e.firebaseapp.com',
  projectId: 'pwa-push-demo-5a61e',
  storageBucket: 'pwa-push-demo-5a61e.firebasestorage.app',
  messagingSenderId: '404242458499',
  appId: '1:404242458499:web:3117487115e23fde66b8b6',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] onBackgroundMessage', payload)

  const { title, body, icon } = payload.notification || {}
  const notificationTitle = title || 'Hey!'
  const notificationBody = body || 'You have a new message.'
  const notificationIcon = icon || '/icon-192.png'
  const link =
    payload?.fcmOptions?.link ||
    payload?.data?.url ||
    '/'

  self.registration.showNotification(notificationTitle, {
    body: notificationBody,
    icon: notificationIcon,
    badge: '/icon-192.png',
    data: { url: link },
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow ? clients.openWindow(url) : undefined
    })
  )
})
