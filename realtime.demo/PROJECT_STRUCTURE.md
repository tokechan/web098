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
│   │   └── push.ts            # Web Push ユーティリティ
│   │
│   ├── public/
│   │   ├── manifest.json      # PWA マニフェスト
│   │   ├── sw.js              # Service Worker
│   │   ├── icon-192.png       # PWA アイコン（要作成）
│   │   ├── icon-512.png       # PWA アイコン（要作成）
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
- Web Push購読管理
- Supabase Realtime接続
- メッセージ送受信UI

**依存関係**:
- Next.js 14+
- React 18+
- @supabase/supabase-js
- Tailwind CSS

### `bff/`

Hono で構築されたBFF（Backend for Frontend）。Cloudflare Workers上で動作。

**主要機能**:
- Web Push送信（VAPID）
- Supabase連携（Service Role）
- 入力検証（Zod）
- CORS設定

**依存関係**:
- Hono
- web-push
- @supabase/supabase-js
- Zod

**エンドポイント**:
- `POST /api/push/subscribe` - Push購読の保存
- `POST /api/push/send` - テスト通知送信
- `POST /api/thanks` - 「ありがとう」送信（実例）

### `supabase/`

Supabase（PostgreSQL）のスキーマ定義とセットアップガイド。

**テーブル**:
- `messages` - メッセージ保存（Realtime有効）
- `push_subscriptions` - Push購読情報

## 主要ファイル解説

### `frontend/public/sw.js`

Service Worker。Web Pushの受信とクリックイベントを処理。

```javascript
self.addEventListener('push', (event) => { /* 通知表示 */ })
self.addEventListener('notificationclick', (event) => { /* アプリ起動 */ })
```

### `frontend/lib/push.ts`

Web Push関連のユーティリティ関数集。

- `registerServiceWorker()` - SW登録
- `requestNotificationPermission()` - 通知許可
- `subscribeToPush()` - Push購読＆BFFに保存
- `sendTestNotification()` - テスト通知送信

### `bff/src/index.ts`

Hono BFFのメインファイル。すべてのAPIエンドポイントを定義。

**ポイント**:
- VAPID設定（秘密鍵管理）
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
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJxxxxx...
```

### BFF (`.dev.vars`)

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
VAPID_PUBLIC_KEY=BJxxxxx...
VAPID_PRIVATE_KEY=abcdef...
VAPID_MAILTO=mailto:your-email@example.com
```

## 開発フロー

### 1. 初回セットアップ

1. `SETUP.md` に従ってSupabase/VAPID設定
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

