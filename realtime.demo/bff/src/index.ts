import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

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

    // VAPID設定
    webpush.setVapidDetails(
      c.env.VAPID_MAILTO,
      c.env.VAPID_PUBLIC_KEY,
      c.env.VAPID_PRIVATE_KEY
    )

    // Push送信
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    }

    const payload = JSON.stringify({
      title,
      body: messageBody,
      url: url || '/',
    })

    await webpush.sendNotification(pushSubscription, payload)

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
      webpush.setVapidDetails(
        c.env.VAPID_MAILTO,
        c.env.VAPID_PUBLIC_KEY,
        c.env.VAPID_PRIVATE_KEY
      )

      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      }

      const payload = JSON.stringify({
        title: '💝 ありがとうが届きました！',
        body: message,
        url: '/',
      })

      try {
        await webpush.sendNotification(pushSubscription, payload)
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

