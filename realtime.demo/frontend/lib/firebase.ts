/**
 * Firebase 初期化ファイル
 */

import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging'

// Firebase設定
const firebaseConfig = {
  apiKey: 'AIzaSyDJGvjxRunvADvo5o2VHQg--Q-U_kZbUao',
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

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  messaging = getMessaging(app)
}

export { app, messaging }

/**
 * FCM トークンを取得
 */
export async function getFCMToken(vapidKey: string): Promise<string | null> {
  if (!messaging) {
    console.warn('[FCM] Messaging not available')
    return null
  }

  try {
    const token = await getToken(messaging, { vapidKey })
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
export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) {
    console.warn('[FCM] Messaging not available')
    return
  }

  onMessage(messaging, (payload) => {
    console.log('[FCM] Foreground message received:', payload)
    callback(payload)
  })
}

