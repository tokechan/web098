import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  VAPID_PUBLIC_KEY: string
  VAPID_PRIVATE_KEY: string
  VAPID_MAILTO: string
  ALLOWED_ORIGINS: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS設定
app.use('/*', async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS.split(',')
  const origin = c.req.header('Origin') || ''
  
  if (allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin)
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type')
  }
  
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204)
  }
  
  await next()
})

// ===== VAPID ユーティリティ関数 =====

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function generateVapidAuthHeader(
  endpoint: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  subject: string
): Promise<string> {
  const url = new URL(endpoint)
  const audience = `${url.protocol}//${url.host}`
  
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 12 * 60 * 60 // 12 hours
  
  const header = {
    typ: 'JWT',
    alg: 'ES256'
  }
  
  const payload = {
    aud: audience,
    exp: exp,
    sub: subject
  }
  
  const headerBase64 = arrayBufferToBase64Url(
    new TextEncoder().encode(JSON.stringify(header))
  )
  const payloadBase64 = arrayBufferToBase64Url(
    new TextEncoder().encode(JSON.stringify(payload))
  )
  
  const unsignedToken = `${headerBase64}.${payloadBase64}`
  
  // VAPID秘密鍵をインポート
  const privateKeyBuffer = urlBase64ToUint8Array(vapidPrivateKey)
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    privateKeyBuffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  )
  
  // 署名
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  )
  
  const signatureBase64 = arrayBufferToBase64Url(signature)
  const jwt = `${unsignedToken}.${signatureBase64}`
  
  return `vapid t=${jwt}, k=${vapidPublicKey}`
}

async function sendWebPush(
  endpoint: string,
  p256dh: string,
  auth: string,
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  subject: string
): Promise<Response> {
  const authHeader = await generateVapidAuthHeader(
    endpoint,
    vapidPublicKey,
    vapidPrivateKey,
    subject
  )
  
  // エンコード処理（簡易版 - 本番では適切な暗号化が必要）
  const payloadBuffer = new TextEncoder().encode(payload)
  
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'Authorization': authHeader,
      'TTL': '86400'
    },
    body: payloadBuffer
  })
}

// ===== API エンドポイント =====

// ヘルスチェック
app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'PWA Push Demo BFF' })
})

// Push購読を保存
const SubscriptionSchema = z.object({
  userId: z.string(),
  subscription: z.object({
    endpoint: z.string(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
})

app.post('/api/push/subscribe', async (c) => {
  try {
    const body = await c.req.json()
    const { userId, subscription } = SubscriptionSchema.parse(body)

    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('Subscription save error:', error)
      return c.json({ error: 'Failed to save subscription' }, 500)
    }

    return c.json({ ok: true })
  } catch (error) {
    console.error('Subscribe endpoint error:', error)
    return c.json({ error: 'Invalid request' }, 400)
  }
})

// テスト通知を送信
const SendNotificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  url: z.string().optional(),
})

app.post('/api/push/send', async (c) => {
  try {
    const body = await c.req.json()
    const { userId, title, body: messageBody, url } = SendNotificationSchema.parse(body)

    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // ユーザーのPush購読を取得
    const { data: subscription, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !subscription) {
      console.error('Subscription not found:', error)
      return c.json({ error: 'Subscription not found' }, 404)
    }

    // Push送信
    const payload = JSON.stringify({
      title,
      body: messageBody,
      url: url || '/',
    })

    const response = await sendWebPush(
      subscription.endpoint,
      subscription.p256dh,
      subscription.auth,
      payload,
      c.env.VAPID_PUBLIC_KEY,
      c.env.VAPID_PRIVATE_KEY,
      c.env.VAPID_MAILTO
    )

    if (!response.ok) {
      console.error('Web Push failed:', await response.text())
      return c.json({ error: 'Failed to send notification' }, 500)
    }

    return c.json({ ok: true })
  } catch (error) {
    console.error('Send notification error:', error)
    return c.json({ error: 'Failed to send notification' }, 500)
  }
})

// 「ありがとう」を送信（実例）
const ThanksSchema = z.object({
  fromUserId: z.string(),
  toUserId: z.string(),
  message: z.string(),
})

app.post('/api/thanks', async (c) => {
  try {
    const body = await c.req.json()
    const { fromUserId, toUserId, message } = ThanksSchema.parse(body)

    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // DBに保存（Realtime経由でUI更新）
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        user_id: fromUserId,
        content: `${message} (to: ${toUserId})`,
      })

    if (insertError) {
      console.error('Insert message error:', insertError)
      return c.json({ error: 'Failed to save message' }, 500)
    }

    // 相手にPush通知送信
    const { data: subscription } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', toUserId)
      .single()

    if (subscription) {
      const payload = JSON.stringify({
        title: '💝 ありがとうが届きました！',
        body: message,
        url: '/',
      })

      try {
        await sendWebPush(
          subscription.endpoint,
          subscription.p256dh,
          subscription.auth,
          payload,
          c.env.VAPID_PUBLIC_KEY,
          c.env.VAPID_PRIVATE_KEY,
          c.env.VAPID_MAILTO
        )
      } catch (pushError) {
        console.error('Push notification error:', pushError)
        // Push失敗してもメッセージは保存済みなのでエラーにしない
      }
    }

    return c.json({ ok: true })
  } catch (error) {
    console.error('Thanks endpoint error:', error)
    return c.json({ error: 'Invalid request' }, 400)
  }
})

export default app
