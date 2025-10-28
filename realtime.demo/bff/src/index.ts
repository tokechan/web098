import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  ALLOWED_ORIGINS: string
  // Firebase Service Account
  FCM_PROJECT_ID: string
  FCM_PRIVATE_KEY: string
  FCM_CLIENT_EMAIL: string
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
    return c.body(null, 204)
  }

  await next()
})

// ヘルスチェック
app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'PWA Push Demo BFF (FCM)' })
})

// Supabaseクライアント取得
function getSupabaseClient(env: Bindings) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })
}

// ===================================
// FCM 関連のユーティリティ関数
// ===================================

/**
 * Base64 URL エンコード
 */
function base64UrlEncode(data: ArrayBuffer): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(data)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Firebase Service Account から OAuth2 アクセストークンを取得
 */
async function getAccessToken(env: Bindings): Promise<string> {
  const now = Math.floor(Date.now() / 1000)

  // JWT Header
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }

  // JWT Payload
  const payload = {
    iss: env.FCM_CLIENT_EMAIL,
    sub: env.FCM_CLIENT_EMAIL,
    aud: 'https://oauth2.googleapis.com/token',
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    iat: now,
    exp: now + 3600,
  }

  // エンコード
  const encoder = new TextEncoder()
  const headerEncoded = base64UrlEncode(encoder.encode(JSON.stringify(header)))
  const payloadEncoded = base64UrlEncode(encoder.encode(JSON.stringify(payload)))
  const message = `${headerEncoded}.${payloadEncoded}`

  // PEM形式の秘密鍵をバイナリに変換
  const pemHeader = '-----BEGIN PRIVATE KEY-----'
  const pemFooter = '-----END PRIVATE KEY-----'
  const pemContents = env.FCM_PRIVATE_KEY.replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, '')

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0))

  // CryptoKeyをインポート
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  )

  // 署名
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, encoder.encode(message))

  // JWT作成
  const jwt = `${message}.${base64UrlEncode(signature)}`

  // アクセストークンを取得
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get access token: ${error}`)
  }

  const data = await response.json<{ access_token: string }>()
  return data.access_token
}

/**
 * FCM 経由でプッシュ通知を送信
 */
async function sendFCMNotification(
  env: Bindings,
  fcmToken: string,
  title: string,
  body: string,
  url?: string
): Promise<void> {
  const accessToken = await getAccessToken(env)

  // data-only メッセージ（フォアグラウンド・バックグラウンド両方で動作）
  const message = {
    message: {
      token: fcmToken,
      // notification フィールドを削除（data-only message）
      data: {
        title,
        body,
        url: url || '/',
        type: 'notification',
      },
    },
  }

  const fcmEndpoint = `https://fcm.googleapis.com/v1/projects/${env.FCM_PROJECT_ID}/messages:send`

  console.log('[FCM] Sending to endpoint:', fcmEndpoint)
  console.log('[FCM] Message payload:', JSON.stringify(message, null, 2))

  const response = await fetch(fcmEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(message),
  })

  console.log('[FCM] Response status:', response.status)

  if (!response.ok) {
    const error = await response.text()
    console.error('[FCM] Send failed:', response.status, error)
    throw new Error(`FCM send failed: ${error}`)
  }

  const responseData = await response.json()
  console.log('[FCM] Response data:', responseData)
  console.log('[FCM] Notification sent successfully')
}

// ===================================
// FCM API エンドポイント
// ===================================

/**
 * FCM トークンを保存
 */
const FCMSubscribeSchema = z.object({
  userId: z.string(),
  fcmToken: z.string(),
})

app.post('/api/fcm/subscribe', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const body = await c.req.json()

  const parsed = FCMSubscribeSchema.safeParse(body)
  if (!parsed.success) {
    console.error('[FCM] Invalid subscription data:', parsed.error)
    return c.json({ error: 'Invalid subscription data' }, 400)
  }

  const { userId, fcmToken } = parsed.data

  try {
    // FCM トークンを保存（既存があれば更新）
    const { data, error } = await supabase
      .from('fcm_tokens')
      .upsert({ user_id: userId, fcm_token: fcmToken }, { onConflict: 'user_id' })
      .select()

    if (error) {
      console.error('[FCM] Failed to save token:', error)
      return c.json({ error: 'Failed to save FCM token' }, 500)
    }

    console.log('[FCM] Token saved:', data)
    return c.json({ message: 'FCM token saved successfully' })
  } catch (error) {
    console.error('[FCM] Subscribe error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * テスト通知を送信（FCM経由）
 */
const FCMSendSchema = z.object({
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  url: z.string().optional(),
})

app.post('/api/fcm/send', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const body = await c.req.json()

  const parsed = FCMSendSchema.safeParse(body)
  if (!parsed.success) {
    console.error('[FCM] Invalid send data:', parsed.error)
    return c.json({ error: 'Invalid notification data' }, 400)
  }

  const { userId, title, body: messageBody, url } = parsed.data

  try {
    // FCM トークンを取得
    const { data: tokenData, error } = await supabase
      .from('fcm_tokens')
      .select('fcm_token')
      .eq('user_id', userId)
      .single()

    if (error || !tokenData) {
      console.error('[FCM] Token not found:', error)
      return c.json({ error: 'FCM token not found for user' }, 404)
    }

    // FCM 経由で通知送信
    await sendFCMNotification(c.env, tokenData.fcm_token, title, messageBody, url)

    return c.json({ message: 'Notification sent successfully' })
  } catch (error) {
    console.error('[FCM] Send error:', error)
    return c.json({ error: 'Failed to send notification' }, 500)
  }
})

/**
 * メッセージ送信（Supabase Realtime + FCM Push）
 */
const ThanksSchema = z.object({
  fromUserId: z.string(),
  toUserId: z.string(),
  message: z.string(),
})

app.post('/api/thanks', async (c) => {
  const supabase = getSupabaseClient(c.env)
  const body = await c.req.json()

  const parsed = ThanksSchema.safeParse(body)
  if (!parsed.success) {
    console.error('[API] Invalid thanks data:', parsed.error)
    return c.json({ error: 'Invalid message data' }, 400)
  }

  const { fromUserId, toUserId, message } = parsed.data

  try {
    // Supabase にメッセージを保存（Realtime経由で配信）
    const { data, error } = await supabase
      .from('messages')
      .insert({ user_id: toUserId, content: message })
      .select()

    if (error) {
      console.error('[API] Failed to save message:', error)
      return c.json({ error: 'Failed to save message' }, 500)
    }

    console.log('[API] Message saved:', data)

    // FCM トークンを取得して通知を送信
    const { data: tokenData } = await supabase
      .from('fcm_tokens')
      .select('fcm_token')
      .eq('user_id', toUserId)
      .single()

    if (tokenData) {
      try {
        await sendFCMNotification(c.env, tokenData.fcm_token, '💝 ありがとうが届きました！', message, '/')
        console.log('[FCM] Push notification sent to user:', toUserId)
      } catch (fcmError) {
        console.error('[FCM] Failed to send push notification:', fcmError)
        // Push失敗してもメッセージは保存済みなのでエラーにしない
      }
    }

    return c.json({ ok: true })
  } catch (error) {
    console.error('[API] Thanks error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
