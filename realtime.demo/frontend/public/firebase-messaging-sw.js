// Service Worker for FCM (Firebase Cloud Messaging)

// Firebase Messaging Service Worker をインポート
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

// Firebase 設定
const firebaseConfig = {
  apiKey: 'AIzaSyDJGvjxRunvADv05o2VHQg--Q-U_kZbUao',
  authDomain: 'pwa-push-demo-5a61e.firebaseapp.com',
  projectId: 'pwa-push-demo-5a61e',
  storageBucket: 'pwa-push-demo-5a61e.firebasestorage.app',
  messagingSenderId: '404242458499',
  appId: '1:404242458499:web:3117487115e23fde66b8b6',
}

// Firebase 初期化
firebase.initializeApp(firebaseConfig)

// Messaging インスタンス取得
const messaging = firebase.messaging()

// バックグラウンドメッセージ受信時
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload)

  const notificationTitle = payload.notification?.title || 'New Message'
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: payload.data?.url || '/',
      timestamp: Date.now(),
    },
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// Install & Activate
self.addEventListener('install', (event) => {
  console.log('[SW] Install event')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event')
  event.waitUntil(clients.claim())
})

// 通知クリック時
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click', event)

  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 既に開いているウィンドウがあればそれにフォーカス
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        // なければ新しいウィンドウを開く
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

