/**
 * Web Push 関連のユーティリティ
 */

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:8787'
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

/**
 * Base64 を Uint8Array に変換（VAPID公開鍵用）
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Service Worker を登録
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('[Push] Service Worker registered:', registration)
    return registration
  } catch (error) {
    console.error('[Push] Service Worker registration failed:', error)
    return null
  }
}

/**
 * 通知許可をリクエスト
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported')
    return 'denied'
  }

  const permission = await Notification.requestPermission()
  console.log('[Push] Notification permission:', permission)
  return permission
}

/**
 * Push購読を取得してBFFに保存
 */
export async function subscribeToPush(userId: string): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready
    
    // 既存の購読を確認
    let subscription = await registration.pushManager.getSubscription()
    
    if (!subscription) {
      // 新規購読
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource,
      })
    }

    console.log('[Push] Subscription:', subscription)

    // BFFに保存
    const response = await fetch(`${BFF_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        subscription: subscription.toJSON(),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to save subscription')
    }

    console.log('[Push] Subscription saved to BFF')
    return true
  } catch (error) {
    console.error('[Push] Subscribe error:', error)
    return false
  }
}

/**
 * Push購読を解除
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    
    if (subscription) {
      await subscription.unsubscribe()
      console.log('[Push] Unsubscribed')
      return true
    }
    
    return false
  } catch (error) {
    console.error('[Push] Unsubscribe error:', error)
    return false
  }
}

/**
 * テスト通知を送信
 */
export async function sendTestNotification(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${BFF_URL}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: 'テスト通知',
        body: 'これはテスト通知です',
        url: '/',
      }),
    })

    return response.ok
  } catch (error) {
    console.error('[Push] Send test notification error:', error)
    return false
  }
}

