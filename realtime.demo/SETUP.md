# セットアップガイド

このガイドに従って、PWA × Web Push × Hono × Supabase のデモを動かしましょう。

## 前提条件

- Node.js 18+ がインストールされていること
- Supabaseアカウント（無料）
- 検証用デバイス（iOS 16.4+ / Android / Desktop）

## Step 1: Supabase プロジェクト作成

### 1.1 プロジェクト作成

1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. プロジェクト名、パスワード、リージョンを設定して作成

### 1.2 スキーマ実行

1. Supabase Dashboard > 左メニュー「SQL Editor」
2. `supabase/schema.sql` の内容をコピー＆ペースト
3. 「RUN」をクリックして実行

### 1.3 Realtime有効化

**方法1: Table Editor から（推奨・簡単）**

1. Supabase Dashboard > **Table Editor**
2. `messages` テーブルを選択
3. 上部の「**Enable Realtime**」ボタンをクリック
4. 確認ダイアログで「**Enable realtime**」をクリック

**方法2: Replication から（旧バージョン）**

1. Supabase Dashboard > Database > **Replication**
2. `messages` テーブルの **Realtime** を **ON** にする

※ プロジェクトによっては Replication メニューがない場合があります。その場合は方法1を使用してください。

### 1.4 認証情報取得

Settings > API から以下を取得：

#### 新方式（推奨）: API Keys タブ

- **Project URL**: `https://xxxxx.supabase.co`
- **Publishable key**: `eyJhb...`（フロントエンド用、公開可能）
- **Secret key**: `eyJhb...`（BFF用、秘密鍵）

#### 旧方式: Legacy API Keys タブ

- **Project URL**: `https://xxxxx.supabase.co`
- **anon key**: `eyJhb...`（フロントエンド用）
- **service_role key**: `eyJhb...`（BFF用、秘密）

**注意**: 新しいプロジェクトでは **API Keys（Publishable key）** を使用してください。機能は同じですが、将来的に Legacy API Keys は廃止される予定です。

## Step 2: VAPID キー生成

Web Push用のVAPIDキーを生成します。

```bash
cd bff
npm install
npx web-push generate-vapid-keys
```

出力例：
```
Public Key:
BJxxxxx...

Private Key:
abcdef...
```

この公開鍵と秘密鍵をメモしてください。

## Step 3: 環境変数設定

### 3.1 Frontend環境変数

```bash
cd frontend
```

`.env.local` ファイルを作成：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# ↑ 新方式の場合は Publishable key を使用（変数名はそのまま）

# BFF
NEXT_PUBLIC_BFF_URL=http://localhost:8787

# VAPID Public Key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJxxxxx...
```

### 3.2 BFF環境変数

```bash
cd ../bff
```

`.dev.vars` ファイルを作成：

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# ↑ 新方式の場合は Secret key を使用（変数名はそのまま）

# VAPID Keys
VAPID_PUBLIC_KEY=BJxxxxx...
VAPID_PRIVATE_KEY=abcdef...
VAPID_MAILTO=mailto:your-email@example.com
```

**注意**: `.dev.vars` は `.gitignore` に含まれているので、誤ってコミットされません。

## Step 4: PWA アイコン作成

PWAには2つのアイコンが必要です。

### 簡易版（テスト用）

以下のサイトで192x192と512x512のPNG画像を作成：

- [Favicon Generator](https://favicon.io/)
- [PWA Image Generator](https://www.pwabuilder.com/imageGenerator)

作成したアイコンを `frontend/public/` に配置：

```
frontend/public/
  ├── icon-192.png
  └── icon-512.png
```

### 本格版

デザインツール（Figma、Canva等）で以下を作成：

- **icon-192.png**: 192x192px
- **icon-512.png**: 512x512px

背景は透過せず、ベタ塗りが推奨です（iOS対応）。

## Step 5: アプリ起動

### Terminal 1: BFF起動

```bash
cd bff
npm install
npm run dev
```

`http://localhost:8787` で起動します。

### Terminal 2: Frontend起動

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:3000` で起動します。

## Step 6: 動作確認

### デスクトップ（Chrome/Edge）

1. `http://localhost:3000` を開く
2. 「Push通知を有効化」をクリック
3. 通知許可ダイアログで「許可」
4. 「テスト通知」をクリック
5. 通知が表示されることを確認 ✅

### Android

1. Chrome で `http://localhost:3000` を開く
2. メニュー > 「ホーム画面に追加」
3. ホーム画面から起動
4. 「Push通知を有効化」→「許可」
5. 「テスト通知」をクリック
6. 通知センターに通知が届くことを確認 ✅

### iOS（最重要）

**前提**: iOS 16.4以降、Safari経由

1. Safari で `http://localhost:3000` を開く
2. 共有ボタン（↑）をタップ
3. 「**ホーム画面に追加**」を選択
4. ホーム画面から起動
5. 「Push通知を有効化」→「許可」
6. 別のデバイスから「テスト通知」を送信
7. iOSの通知センターに届くことを確認 ✅

**注意**: iOSではSafariで開いているだけでは通知が届きません。必ず**A2HS（ホーム画面に追加）**してから起動してください。

## Step 7: Realtime動作確認

1. 複数のブラウザ/タブでアプリを開く
2. 片方で「メッセージを送信」
3. もう片方の画面が**即座に更新**されることを確認 ✅

これはSupabase Realtimeが動作している証拠です。

## トラブルシューティング

### 通知が届かない

- [ ] Service Workerが登録されているか（DevTools > Application > Service Workers）
- [ ] 通知許可が「許可」になっているか
- [ ] iOS の場合、ホーム画面に追加しているか
- [ ] `.env.local` / `.dev.vars` の設定は正しいか
- [ ] BFF が起動しているか（`http://localhost:8787` にアクセス）

### Realtime が動かない

- [ ] Supabase Dashboard > Database > Replication で `messages` が ON か
- [ ] `schema.sql` を正しく実行したか
- [ ] ブラウザのコンソールにエラーが出ていないか

### CORS エラー

- [ ] BFF の `wrangler.toml` で `ALLOWED_ORIGINS` にフロントエンドのURLが含まれているか

## 次のステップ

動作確認できたら：

1. ユーザー認証を追加（Supabase Auth）
2. RLSポリシーを本番用に変更
3. 「ありがとう」機能を実装（`/api/thanks` エンドポイント使用）
4. Cloudflare Workers にデプロイ
5. Vercel にフロントエンドをデプロイ

お疲れ様でした！🎉

