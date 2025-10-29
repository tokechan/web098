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
    // 既存のService Workerを確認
    const existingRegistration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
    
    if (existingRegistration) {
      console.log('[FCM] Service Worker already registered:', existingRegistration)
      await existingRegistration.update() // 強制的に更新
      return existingRegistration
    }

    // 新規登録
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    })
    console.log('[FCM] Service Worker registered:', registration)
    
    // 登録完了を待つ
    await navigator.serviceWorker.ready
    console.log('[FCM] Service Worker ready!')
    
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
 * フォアグラウンドメッセージリスナーをセットアップ（初回のみ）
 */
export async function setupMessageListener() {
  console.log('[FCM] Setting up message listener...')
  await onForegroundMessage((payload) => {
    console.log('[FCM] Message received in app:', payload)
    // 必要に応じて追加の処理をここに書く（UIの更新など）
  })
}

/**
 * FCM トークンを取得してBFFに保存
 */
export async function subscribeToPush(userId: string): Promise<boolean> {
  try {
    console.log('[FCM] Starting subscription process for user:', userId)
    
    // Service Worker が登録されるまで待機
    console.log('[FCM] Waiting for service worker...')
    await navigator.serviceWorker.ready
    console.log('[FCM] Service worker ready!')

    // FCM トークンを取得
    console.log('[FCM] Requesting FCM token with VAPID key...')
    const fcmToken = await getFCMToken(FCM_VAPID_KEY)

    if (!fcmToken) {
      console.error('[FCM] Failed to get FCM token')
      return false
    }

    console.log('[FCM] Token obtained:', fcmToken)

    // BFFに保存
    console.log('[FCM] Saving token to BFF:', BFF_URL)
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
    console.log('[FCM] Subscription completed successfully!')
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
    const link = typeof window !== 'undefined' ? `${window.location.origin}/` : '/'
    const response = await fetch(`${BFF_URL}/api/fcm/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: 'テスト通知',
        body: 'これはFCM経由のテスト通知です！',
        url: link,
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
    console.log('[FCM] Sending message via BFF:', { fromUserId, toUserId, message })

    const response = await fetch(`${BFF_URL}/api/thanks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromUserId,
        toUserId,
        message,
        url: typeof window !== 'undefined' ? `${window.location.origin}/` : '/',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[FCM] Failed to send message:', response.status, errorText)
      return false
    }

    console.log('[FCM] Message sent successfully')
    return true
  } catch (error) {
    console.error('[FCM] Error sending message:', error)
    return false
  }
}
