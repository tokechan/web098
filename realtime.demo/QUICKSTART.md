# クイックスタート（5分で動かす）

**前提**: Node.js 18+、Supabaseアカウント

## 1. Supabase設定（2分）

```bash
# 1. https://supabase.com でプロジェクト作成
# 2. SQL Editorで supabase/schema.sql を実行
# 3. Table Editor > messages テーブル > "Enable Realtime" をクリック
# 4. Settings > API から URL と Keys をコピー
#    新方式: Publishable key と Secret key
#    旧方式: anon key と service_role key（どちらでも動作）
```

## 2. VAPIDキー生成（1分）

```bash
cd bff
npm install
npx web-push generate-vapid-keys
```

出力された Public Key と Private Key をメモ。

## 3. 環境変数設定（1分）

### Frontend

`frontend/.env.local` を作成：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_BFF_URL=http://localhost:8787
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJxxxxx...
```

### BFF

`bff/.dev.vars` を作成：

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
VAPID_PUBLIC_KEY=BJxxxxx...
VAPID_PRIVATE_KEY=abcdef...
VAPID_MAILTO=mailto:you@example.com
```

## 4. PWAアイコン配置（1分）

`frontend/public/` に以下を配置：

- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

**簡単な方法**: https://favicon.io/favicon-generator/ で生成

## 5. 起動（1分）

### Terminal 1: BFF

```bash
cd bff
npm install
npm run dev
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

## 6. 動作確認

### デスクトップ（Chrome）

1. http://localhost:3000 を開く
2. 「Push通知を有効化」→「許可」
3. 「テスト通知」→ 通知が表示される ✅

### iOS（Safari）

1. http://localhost:3000 を開く
2. 共有ボタン → **「ホーム画面に追加」**
3. ホーム画面から起動
4. 「Push通知を有効化」→「許可」
5. 別デバイスから「テスト通知」送信
6. 通知センターに届く ✅

## トラブル？

詳細は `SETUP.md` を参照してください。

## 次のステップ

- `ARCHITECTURE.md` - 技術詳細を理解
- `PROJECT_STRUCTURE.md` - ファイル構成を把握
- コードを読んで拡張してみる

お疲れ様でした！🎉

