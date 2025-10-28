// Service Worker for FCM (Firebase Cloud Messaging)

console.log('[SW] Service Worker script loaded')

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
console.log('[SW] Firebase initialized')

// Messaging インスタンス取得
const messaging = firebase.messaging()
console.log('[SW] Messaging instance created')

// バックグラウンドメッセージ受信時
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload)
  console.log('[SW] Payload data:', payload.data)
  console.log('[SW] Payload notification:', payload.notification)

  // data メッセージから通知情報を取得
  const notificationTitle = payload.data?.title || payload.notification?.title || 'New Message'
  const notificationBody = payload.data?.body || payload.notification?.body || ''
  
  console.log('[SW] Extracted - Title:', notificationTitle, 'Body:', notificationBody)
  
  const notificationOptions = {
    body: notificationBody,
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

// Push イベントを直接リスン（デバッグ用 + フォールバック）
self.addEventListener('push', (event) => {
  console.log('[SW] ===== PUSH EVENT RECEIVED =====')
  console.log('[SW] Event:', event)
  
  if (event.data) {
    console.log('[SW] Has data!')
    try {
      const text = event.data.text()
      console.log('[SW] Raw text:', text)
      
      try {
        const json = JSON.parse(text)
        console.log('[SW] Parsed JSON:', json)
        
        // FCM の data-only メッセージの場合、手動で通知を表示
        if (json.data) {
          console.log('[SW] Showing notification from push event')
          const title = json.data.title || 'New Message'
          const body = json.data.body || ''
          const url = json.data.url || '/'
          
          event.waitUntil(
            self.registration.showNotification(title, {
              body: body,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              data: { url: url }
            })
          )
        }
      } catch (e) {
        console.log('[SW] Not valid JSON:', e)
      }
    } catch (e) {
      console.error('[SW] Error reading data:', e)
    }
  } else {
    console.log('[SW] No data in push event')
  }
  
  console.log('[SW] ===== END PUSH EVENT =====')
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

