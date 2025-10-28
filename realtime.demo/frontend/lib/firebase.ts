/**
 * Firebase 初期化ファイル
 */

import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported, type Messaging } from 'firebase/messaging'

// Firebase設定
const firebaseConfig = {
  apiKey: 'AIzaSyDJGvjxRunvADv05o2VHQg--Q-U_kZbUao',
  authDomain: 'pwa-push-demo-5a61e.firebaseapp.com',
  projectId: 'pwa-push-demo-5a61e',
  storageBucket: 'pwa-push-demo-5a61e.firebasestorage.app',
  messagingSenderId: '404242458499',
  appId: '1:404242458499:web:3117487115e23fde66b8b6',
  measurementId: 'G-8P0ZW84W6L',
}

// Firebase アプリの初期化（既に初期化されている場合はスキップ）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Messaging インスタンス（ブラウザのみ）
let messaging: Messaging | null = null
let messageListenerSetup = false // リスナーが既にセットアップされているかのフラグ

// Messagingインスタンスを遅延初期化する関数
async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[FCM] Service Worker not supported')
    return null
  }
  
  // ブラウザがMessaging APIをサポートしているか確認
  const supported = await isSupported()
  if (!supported) {
    console.error('[FCM] Messaging API not supported in this browser')
    return null
  }
  
  if (!messaging) {
    try {
      messaging = getMessaging(app)
      console.log('[FCM] Messaging instance initialized successfully')
    } catch (error) {
      console.error('[FCM] Failed to initialize Messaging:', error)
      return null
    }
  }
  
  return messaging
}

export { app, messaging }

/**
 * FCM トークンを取得
 */
export async function getFCMToken(vapidKey: string): Promise<string | null> {
  const messagingInstance = await getMessagingInstance()
  
  if (!messagingInstance) {
    console.warn('[FCM] Messaging not available')
    return null
  }

  try {
    // Service Worker登録を取得
    const registration = await navigator.serviceWorker.ready
    console.log('[FCM] Using service worker registration:', registration)
    
    const token = await getToken(messagingInstance, { 
      vapidKey,
      serviceWorkerRegistration: registration
    })
    console.log('[FCM] Token obtained:', token)
    return token
  } catch (error) {
    console.error('[FCM] Failed to get token:', error)
    return null
  }
}

/**
 * フォアグラウンドメッセージを受信
 */
export async function onForegroundMessage(callback: (payload: any) => void) {
  const messagingInstance = await getMessagingInstance()
  
  if (!messagingInstance) {
    console.warn('[FCM] Messaging not available')
    return
  }

  // 既にセットアップ済みの場合はスキップ
  if (messageListenerSetup) {
    console.log('[FCM] Message listener already setup, skipping...')
    return
  }

  console.log('[FCM] Setting up foreground message listener...')
  messageListenerSetup = true
  
  onMessage(messagingInstance, (payload) => {
    console.log('[FCM] Foreground message received:', payload)
    console.log('[FCM] Payload data:', payload.data)
    console.log('[FCM] Payload notification:', payload.notification)
    
    // data-only メッセージから情報を取得（notification は使わない）
    const title = payload.data?.title || payload.notification?.title || 'New Message'
    const body = payload.data?.body || payload.notification?.body || ''
    const url = payload.data?.url || payload.fcmOptions?.link || '/'
    
    console.log('[FCM] Extracted - Title:', title, 'Body:', body, 'URL:', url)
    
    // フォアグラウンドでは手動で通知を表示
    if ('Notification' in window && Notification.permission === 'granted') {
      console.log('[FCM] Creating notification...')
      const notification = new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: { url },
      })
      
      console.log('[FCM] Notification created:', notification)
      
      // 通知クリック時にURLを開く
      notification.onclick = () => {
        console.log('[FCM] Notification clicked')
        window.focus()
        if (url && url !== '/') {
          window.location.href = url
        }
        notification.close()
      }
    } else {
      console.warn('[FCM] Cannot show notification - Permission:', Notification?.permission)
    }
    
    callback(payload)
  })
  
  console.log('[FCM] Foreground message listener setup complete')
}

