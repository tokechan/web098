/**
 * FCM (Firebase Cloud Messaging) 関連のユーティリティ
 */

import { getFCMToken, onForegroundMessage } from './firebase'

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || 'https://pwa-push-demo-bff.fleatoke.workers.dev'
const FCM_VAPID_KEY =
  process.env.NEXT_PUBLIC_FCM_VAPID_KEY ||
  'BE2iSLa-FL5AVipAlX83gtTLbWhO52btG2t4w7lTRwyTgBRaDNKCHMs_YsYVJq6qkLFIIDZ8Y8J21GCDnLvoEeo'

/**
 * Service Worker を登録
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[FCM] Service Worker not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    console.log('[FCM] Service Worker registered:', registration)
    return registration
  } catch (error) {
    console.error('[FCM] Service Worker registration failed:', error)
    return null
  }
}

/**
 * 通知許可をリクエスト
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('[FCM] Notifications not supported')
    return 'denied'
  }

  const permission = await Notification.requestPermission()
  console.log('[FCM] Notification permission:', permission)
  return permission
}

/**
 * FCM トークンを取得してBFFに保存
 */
export async function subscribeToPush(userId: string): Promise<boolean> {
  try {
    // Service Worker が登録されるまで待機
    await navigator.serviceWorker.ready

    // FCM トークンを取得
    const fcmToken = await getFCMToken(FCM_VAPID_KEY)

    if (!fcmToken) {
      console.error('[FCM] Failed to get FCM token')
      return false
    }

    console.log('[FCM] Token obtained:', fcmToken)

    // BFFに保存
    const response = await fetch(`${BFF_URL}/api/fcm/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        fcmToken,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[FCM] Failed to save token:', response.status, errorText)
      return false
    }

    console.log('[FCM] Token saved to BFF')

    // フォアグラウンドメッセージをリスン
    onForegroundMessage((payload) => {
      console.log('[FCM] Foreground message:', payload)

      // 通知を表示
      if (payload.notification) {
        new Notification(payload.notification.title || 'New Message', {
          body: payload.notification.body || '',
          icon: '/icon-192.png',
        })
      }
    })

    return true
  } catch (error) {
    console.error('[FCM] Subscription failed:', error)
    return false
  }
}

/**
 * テスト通知を送信（BFF経由でFCMに送信）
 */
export async function sendTestNotification(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BFF_URL}/api/fcm/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: 'テスト通知',
        body: 'これはFCM経由のテスト通知です！',
        url: '/',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[FCM] Failed to send test notification:', response.status, errorText)
      return false
    }

    console.log('[FCM] Test notification sent!')
    return true
  } catch (error) {
    console.error('[FCM] Error sending test notification:', error)
    return false
  }
}

/**
 * メッセージを送信（Realtime & FCM Push）
 */
export async function sendMessage(fromUserId: string, toUserId: string, message: string): Promise<boolean> {
  try {
    const response = await fetch(`${BFF_URL}/api/thanks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromUserId, toUserId, message }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[FCM] Failed to send message:', response.status, errorText)
      return false
    }

    console.log('[FCM] Message sent!')
    return true
  } catch (error) {
    console.error('[FCM] Error sending message:', error)
    return false
  }
}
