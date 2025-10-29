# プロジェクト構成

```
realtime.demo/
├── README.md                   # プロジェクト概要
├── SETUP.md                    # セットアップガイド（必読）
├── ARCHITECTURE.md             # アーキテクチャ詳細
├── PROJECT_STRUCTURE.md        # このファイル
├── .gitignore                  # Git除外設定
│
├── frontend/                   # Next.js PWA
│   ├── app/
│   │   ├── layout.tsx         # レイアウト（PWAメタ情報）
│   │   ├── page.tsx           # メインページ
│   │   └── globals.css        # グローバルスタイル
│   │
│   ├── lib/
│   │   ├── supabase.ts        # Supabaseクライアント
│   │   ├── push.ts            # FCM / BFF ユーティリティ
│   │   └── firebase.ts        # Firebase初期化とトークン管理
│   │
│   ├── public/
│   │   ├── manifest.json      # PWA マニフェスト
│   │   ├── firebase-messaging-sw.js  # Firebase Cloud Messaging SW
│   │   ├── icon-192.png       # PWA アイコン
│   │   ├── icon-512.png       # PWA アイコン
│   │   └── ICONS.md           # アイコン作成ガイド
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── .env.local             # 環境変数（要作成）
│       └── .env.example       # 環境変数サンプル
│
├── bff/                        # Hono BFF (Cloudflare Workers)
│   ├── src/
│   │   └── index.ts           # メインエントリーポイント
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── wrangler.toml          # Cloudflare Workers設定
│   ├── .dev.vars              # 環境変数（要作成）
│   └── .dev.vars.example      # 環境変数サンプル
│
└── supabase/                   # Supabase設定
    ├── schema.sql             # DBスキーマ定義
    └── README.md              # Supabaseセットアップガイド
```

## ディレクトリの役割

### `frontend/`

Next.js で構築されたPWAフロントエンド。

**主要機能**:
- PWA対応（manifest.json, Service Worker）
- Firebase Cloud Messaging 購読・通知トリガ
- Supabase Realtime接続
- メッセージ送受信UI

**依存関係**:
- Next.js 14+
- React 18+
- firebase 12+
- @supabase/supabase-js
- Tailwind CSS

### `bff/`

Hono で構築されたBFF（Backend for Frontend）。Cloudflare Workers上で動作。

**主要機能**:
- Firebase Cloud Messaging v1 送信（Service Account）
- Supabase連携（Service Role）
- 入力検証（Zod）
- CORS設定

**依存関係**:
- Hono
- @supabase/supabase-js
- Zod

**エンドポイント**:
- `POST /api/fcm/subscribe` - FCMトークン保存
- `POST /api/fcm/send` - テスト通知送信
- `POST /api/notify` - 任意トークン通知
- `POST /api/thanks` - メッセージ保存 + 通知トリガ

### `supabase/`

Supabase（PostgreSQL）のスキーマ定義とセットアップガイド。

**テーブル**:
- `messages` - メッセージ保存（Realtime有効）
- `push_subscriptions` - Push購読情報

## 主要ファイル解説

### `frontend/public/firebase-messaging-sw.js`

Firebase Cloud Messaging の Service Worker。バックグラウンド通知とクリック遷移を処理。

```javascript
self.addEventListener('push', (event) => { /* 通知表示 */ })
self.addEventListener('notificationclick', (event) => { /* アプリ起動 */ })
```

### `frontend/lib/firebase.ts`

Firebase アプリ初期化と Messaging インスタンスの管理、トークン取得／フォアグラウンド通知を担当。

### `frontend/lib/push.ts`

FCM関連ユーティリティ。Service Worker 登録、通知許可、BFF への購読／送信を行う。

- `registerServiceWorker()` - SW登録
- `requestNotificationPermission()` - 通知許可
- `subscribeToPush()` - Push購読＆BFFに保存
- `sendTestNotification()` - テスト通知送信

### `bff/src/index.ts`

Hono BFFのメインファイル。すべてのAPIエンドポイントを定義。

**ポイント**:
- FCM Service Account で JWT を発行し、v1 API に送信
- Supabase Service Role（最小権限）
- Zodバリデーション

### `supabase/schema.sql`

PostgreSQLスキーマ定義。

**ポイント**:
- Realtime有効化（`REPLICA IDENTITY FULL`）
- RLSポリシー（開発用は全オープン、本番は要変更）
- インデックス最適化

## 環境変数

### Frontend (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
NEXT_PUBLIC_BFF_URL=http://localhost:8787
NEXT_PUBLIC_FCM_VAPID_KEY=BJxxxxx...
```

### BFF (`.dev.vars`)

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
ALLOWED_ORIGINS=https://your-frontend.example.com
FCM_PROJECT_ID=pwa-push-demo-xxxx
FCM_CLIENT_EMAIL=firebase-adminsdk-xxxx@project.iam.gserviceaccount.com
FCM_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
```

## 開発フロー

### 1. 初回セットアップ

1. `SETUP.md` に従って Supabase / FCM 設定（Service Account & VAPID 公開鍵）
2. 環境変数ファイルを作成
3. PWAアイコンを配置

### 2. 開発

```bash
# Terminal 1
cd bff && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### 3. デプロイ

```bash
# BFF
cd bff && npm run deploy

# Frontend
cd frontend && vercel
```

## 拡張ポイント

### 認証追加

Supabase Authを使用：

```typescript
// frontend
const { data, error } = await supabase.auth.signUp({
  email, password
})
```

### キュー処理

Cloudflare Queuesで再送・遅延送信：

```typescript
// bff
await c.env.PUSH_QUEUE.send({ subscription, payload })
```

### 定期通知

Cloudflare Cronで朝のまとめ通知：

```toml
# wrangler.toml
[triggers]
crons = ["0 9 * * *"]
```

```typescript
export default {
  async scheduled(event, env, ctx) {
    // 定期処理
  }
}
```

## トラブルシューティング

### よくある問題

1. **iOSで通知が届かない**
   - → ホーム画面に追加しているか確認

2. **Realtime更新されない**
   - → Supabase Dashboard > Replication 確認

3. **CORS エラー**
   - → `wrangler.toml` の `ALLOWED_ORIGINS` 確認

4. **Service Worker が登録されない**
   - → DevTools > Application > Service Workers 確認
   - → キャッシュクリア後リロード

詳細は `SETUP.md` のトラブルシューティングセクションを参照。

## 参考リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Hono Documentation](https://hono.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
