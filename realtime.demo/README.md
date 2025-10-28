# PWA × Web Push × Hono × Supabase 検証テンプレート

最小構成でPWA通知機能を検証するためのテンプレートです。

## 🎯 このテンプレートでできること

- ✅ **PWA（ホーム画面追加）** - アプリライクな体験
- ✅ **Web Push通知（VAPID）** - アプリ非起動時も通知が届く
- ✅ **Supabase Realtime** - リアルタイムUI更新
- ✅ **iOS 16.4+ / Android / Desktop 対応** - クロスプラットフォーム

## 📁 構成

```
realtime.demo/
├── frontend/          # Next.js PWA (通知UI)
├── bff/              # Hono BFF (Web Push送信)
└── supabase/         # DBスキーマ・設定
```

## 🚀 クイックスタート

**5分で動かせます！** → **[QUICKSTART.md](./QUICKSTART.md)** を参照

### 概要

1. Supabaseプロジェクト作成 & スキーマ実行
2. VAPIDキー生成
3. 環境変数設定
4. PWAアイコン配置
5. 起動 → 動作確認

## 📚 ドキュメント

| ファイル | 内容 |
|---------|------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 5分で動かすクイックスタート |
| **[SETUP.md](./SETUP.md)** | 詳細なセットアップガイド |
| **[API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)** | Supabase APIキー（新旧対応） |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | アーキテクチャ解説 |
| **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** | ファイル構成と役割 |

## 🔧 セットアップ（詳細版）

### 1. Supabase プロジェクト作成

1. [Supabase](https://supabase.com) でプロジェクト作成
2. `supabase/schema.sql` を実行してテーブル作成
3. URL と Service Role Key をメモ

### 2. VAPID キー生成

```bash
cd bff
npm install
npx web-push generate-vapid-keys
```

### 3. 環境変数設定

```bash
# frontend/.env.local
cp frontend/.env.example frontend/.env.local
# 値を埋める

# bff/.dev.vars
cp bff/.dev.vars.example bff/.dev.vars
# 値を埋める
```

### 4. 起動

```bash
# Terminal 1: BFF
cd bff
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

## iOS で通知を受け取るには

1. Safari で `http://localhost:3000` を開く
2. 共有ボタン → **「ホーム画面に追加」**
3. ホーム画面から起動
4. 通知許可を承認
5. 別のブラウザやデバイスからテスト通知を送信

## アーキテクチャ

### リアルタイム更新（アプリ起動中）
```
[Next.js] ⟷ Supabase Realtime ⟷ Postgres
```

### プッシュ通知（アプリ非起動時）
```
[イベント発生] → [Hono BFF] → Web Push (VAPID) → [通知センター]
```

## API エンドポイント

### BFF (Hono)

- `POST /api/push/subscribe` - Push購読の保存
- `POST /api/push/send` - テスト通知送信
- `POST /api/thanks` - 「ありがとう」送信（実例）

## 🚢 本番デプロイ

### Frontend (Vercel)
```bash
cd frontend
vercel
```

環境変数を Vercel Dashboard で設定。

### BFF (Cloudflare Workers)
```bash
cd bff
npm run deploy
```

環境変数を Cloudflare Dashboard または `wrangler secret put` で設定。

詳細は [SETUP.md](./SETUP.md) を参照。

## 📖 学習リソース

- [Hono Documentation](https://hono.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Web Push API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [PWA (web.dev)](https://web.dev/progressive-web-apps/)

## 🤝 貢献

Issue・PRを歓迎します！

## 📄 ライセンス

MIT

