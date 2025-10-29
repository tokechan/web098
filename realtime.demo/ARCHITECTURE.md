# アーキテクチャ詳細

このドキュメントでは、PWA × Web Push × Hono × Supabase の技術的な詳細を説明します。

## 全体構成

```
┌─────────────────────────────────────────────────────────┐
│                    User Device                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js PWA (Frontend)                          │  │
│  │  - Service Worker (firebase-messaging-sw.js)     │  │
│  │  - Firebase Cloud Messaging SDK                  │  │
│  │  - Push API / Notifications API                  │  │
│  │  - Supabase Realtime Client                      │  │
│  └──────────────────────────────────────────────────┘  │
│           │                          │                   │
│           │ WebSocket (Realtime)     │ HTTP (API)        │
│           ↓                          ↓                   │
└───────────┼──────────────────────────┼───────────────────┘
            │                          │
            │                          ↓
            │              ┌──────────────────────────┐
            │              │  Hono BFF                │
            │              │  (Cloudflare Workers)    │
│              │  - FCMv1 Push送信        │
            │              │  - Supabase Client       │
            │              │  - Zod Validation        │
            │              └──────────────────────────┘
            │                          │
            │                          │ SQL / REST API
            ↓                          ↓
   ┌────────────────────────────────────────────────┐
   │           Supabase                              │
   │  ┌────────────────┐      ┌──────────────────┐ │
   │  │  PostgreSQL    │◄────►│  Realtime Engine │ │
   │  └────────────────┘      └──────────────────┘ │
   └────────────────────────────────────────────────┘
```

## 2つの通知経路

### 1. リアルタイム更新（アプリ起動中）

**用途**: UIの即時反映、ライブフィード、チャット等

```
[DB更新] → Supabase Realtime → WebSocket → Frontend UI更新
```

**特徴**:
- ✅ レイテンシが低い（数十ms）
- ✅ 双方向通信
- ❌ アプリ非起動時は届かない

**実装**:
```typescript
// Frontend
const channel = supabase
  .channel('messages')
  .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'messages' },
      (payload) => {
        // UI更新
      }
  )
  .subscribe()
```

### 2. Web Push通知（アプリ非起動時）

**用途**: 通知センターへの到達、リエンゲージメント

```
[イベント発生] → Hono BFF → Firebase Cloud Messaging v1 → 通知センター
```

**特徴**:
- ✅ アプリ非起動時も届く
- ✅ 通知センターに表示
- ❌ レイテンシが高め（数秒）
- ❌ ユーザーの明示的な許可が必要

**実装**:
```typescript
// BFF (Hono)
const message = {
  message: {
    token: fcmToken,
    notification: { title, body },
    webpush: {
      notification: {
        title,
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      },
      data: { url: url ?? '/' },
      fcm_options: { link: url ?? '/' },
    },
  },
}

await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${await getAccessToken()}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(message),
})
```

```javascript
// Service Worker
self.addEventListener('push', (event) => {
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      data: { url: data.url }
    })
  )
})
```

## データフロー例：「ありがとう」機能

### シナリオ

ユーザーA → ユーザーB に「ありがとう」を送る

### フロー

1. **フロントエンド（ユーザーA）**
   ```typescript
   await fetch(`${BFF_URL}/api/thanks`, {
     method: 'POST',
     body: JSON.stringify({
       fromUserId: 'A',
       toUserId: 'B',
       message: 'ありがとう！'
     })
   })
   ```

2. **BFF（Hono）**
   ```typescript
   // ① DBに保存（Realtime経由でUI更新）
   await supabase.from('messages').insert({ ... })
   
   // ② ユーザーBのPush購読を取得
  const { data: tokenRow } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', 'B')
    .single()
   
   // ③ Push送信
  await sendFCMNotification(env, tokenRow.fcm_token, 'ありがとう！', message, '/')
```

3. **Supabase Realtime**
   ```
   messages テーブル更新 → WebSocket経由で全クライアントに配信
   ```

4. **ユーザーBのデバイス**
   - **起動中**: Realtime経由でUI即時更新 ✅
   - **非起動**: Web Push経由で通知センターに表示 ✅

## iOS対応の重要ポイント

### iOS 16.4+ の制約

| 条件 | 必須/推奨 |
|------|----------|
| iOS 16.4以降 | 必須 |
| ホーム画面に追加（A2HS） | **必須** |
| Service Worker | 必須 |
| `manifest.json` | 必須 |
| `display: "standalone"` | 必須 |
| 通知許可 | 必須 |
| HTTPS（本番） | 必須 |

### A2HS（Add to Home Screen）の実装

```typescript
// ユーザーにA2HSを促すUI
const [isStandalone, setIsStandalone] = useState(false)

useEffect(() => {
  const isPWA = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone === true
  setIsStandalone(isPWA)
}, [])

{!isStandalone && (
  <div className="alert">
    📱 iOSで通知を受け取るには「ホーム画面に追加」してください
  </div>
)}
```

### 役割

- **公開鍵**: Push購読時にブラウザに渡す
- **秘密鍵**: Push送信時の署名に使用（BFF内部のみ）

### セキュリティ

- ✅ 秘密鍵は**絶対に公開しない**（環境変数で管理）
- ✅ 本番環境では異なるキーを使用
- ✅ ローテーション可能（全ユーザーの再購読が必要）

## Cloudflare Workers のメリット

### 1. グローバルエッジ配信

- 世界中のエッジロケーションで実行
- レイテンシが低い

### 2. スケーラビリティ

- 無料プランでも1日10万リクエスト
- オートスケール

### 3. 統合エコシステム

- **D1**: SQLite互換DB
- **KV**: Key-Value ストア
- **Queues**: ジョブキュー（再送、遅延送信）
- **Cron**: 定期実行

### 4. コスト

- 無料枠が大きい
- 従量課金で予測可能

## 本番環境へのデプロイ

### Frontend（Vercel）

```bash
cd frontend
vercel
```

環境変数を Vercel Dashboard で設定：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BFF_URL`（本番BFFのURL）
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`

### BFF（Cloudflare Workers）

```bash
cd bff
npm run deploy
```

環境変数を Cloudflare Dashboard で設定：
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_MAILTO`

または `wrangler secret put` コマンドで設定：

```bash
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put VAPID_PRIVATE_KEY
```

### HTTPS必須

本番環境では**HTTPS**が必須です：
- Vercel / Cloudflare は自動でHTTPS化
- 独自ドメインも簡単に設定可能

## パフォーマンス最適化

### 1. Push送信の非同期化

```typescript
// 同期的（遅い）
await webpush.sendNotification(subscription, payload)
return c.json({ ok: true })

// 非同期化（速い）
c.executionCtx.waitUntil(
  webpush.sendNotification(subscription, payload)
)
return c.json({ ok: true })
```

### 2. Cloudflare Queues での再送

```typescript
// Push失敗時にキューに追加
if (pushError) {
  await c.env.PUSH_QUEUE.send({
    subscription,
    payload,
    retry: 1
  })
}
```

### 3. バッチ送信

複数ユーザーへの一括送信：

```typescript
const users = await getTargetUsers()
await Promise.all(
  users.map(user => sendPushNotification(user))
)
```

## セキュリティ考慮事項

### 1. RLS（Row Level Security）

開発環境では全オープンですが、**本番では必須**：

```sql
CREATE POLICY "Users can only access their own data"
  ON messages FOR ALL
  USING (auth.uid()::text = user_id);
```

### 2. Rate Limiting

```typescript
// Cloudflare Workers での実装例
import { RateLimiter } from '@cloudflare/workers-rate-limiter'

const limiter = new RateLimiter({ ... })
const { success } = await limiter.limit(userId)
if (!success) {
  return c.json({ error: 'Too many requests' }, 429)
}
```

### 3. 入力検証

```typescript
import { z } from 'zod'

const Schema = z.object({
  message: z.string().min(1).max(500),
  userId: z.string().uuid()
})

const validated = Schema.parse(body) // 自動でエラーをスロー
```

## 監視・ログ

### Cloudflare Workers

```typescript
console.log('[Push] Sent notification:', { userId, success })
```

Cloudflare Dashboard > Workers > Logs でリアルタイム確認可能。

### Supabase

Database > Logs で SQL実行ログを確認。

## まとめ

このアーキテクチャの利点：

1. ✅ **起動中・非起動時の両方に対応**（Realtime + Push）
2. ✅ **iOS 16.4+ で動作**（A2HS + VAPID）
3. ✅ **スケーラブル**（Cloudflare Workers + Supabase）
4. ✅ **低レイテンシ**（エッジ配信 + WebSocket）
5. ✅ **コスト効率**（無料枠が大きい）
6. ✅ **拡張性**（Queues、Cron、認証など）

無駄を削ぎ落とした最小構成で、本番環境にも適用可能な設計です。
