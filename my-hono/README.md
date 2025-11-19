# my-hono (ver1)

## これはボツ

HonoX（Hono + Islands Architecture）を使用したブログアプリケーション。Cloudflare Workers/Pages にデプロイ可能な SSR フレームワークで構築されています。

## 技術スタック

### コアフレームワーク

- **HonoX**: `^0.1.47` - [HonoX](https://github.com/honojs/honox) (Hono + Islands Architecture)
- **Hono**: `^4.9.9` - Web フレームワーク
- **Node.js**: 18 以上

### ランタイム・デプロイ

- **Cloudflare Workers/Pages**: デプロイ先
- **Wrangler**: `^4.4.0` - Cloudflare Workers 開発ツール
- **@cloudflare/workers-types**: `^4.20250214.0` - TypeScript 型定義

### ビルド・開発ツール

- **Vite**: `^6.3.5` - ビルドツール
- **@hono/vite-build**: `^1.3.0` - Hono 用 Vite ビルドプラグイン
- **@hono/vite-dev-server**: `^0.18.2` - Hono 用 Vite 開発サーバープラグイン

### スタイリング

- **Tailwind CSS**: `^4.0.9` - CSS フレームワーク
- **@tailwindcss/vite**: `^4.0.9` - Tailwind CSS Vite プラグイン

### バリデーション・スキーマ

- **Zod**: `^4.1.11` - TypeScript ファーストのスキーマバリデーション
- **@hono/zod-validator**: `^0.7.3` - Hono 用 Zod バリデーターミドルウェア

### その他

- **Markdoc**: `@markdoc/markdoc@^0.5.4` - Markdown パーサー
- **pnpm**: `10.21.0` - パッケージマネージャー（`packageManager` フィールドで指定）
- **TypeScript**: `@types/node@^24.6.2`

## 機能

- ブログ記事の一覧表示
- ブログ記事の詳細表示（Markdown パース対応）
- ブログ記事の作成（フォームバリデーション付き）
- Islands Architecture によるインタラクティブな UI
- Tailwind CSS によるレスポンシブデザイン
- Suspense を使った非同期レンダリング

## セットアップ

### 必要な環境

- Node.js 18 以上
- pnpm 10.21.0 以上（`packageManager` フィールドで指定）

### インストール

```bash
pnpm install
```

## 開発

### 開発サーバーの起動

```bash
pnpm run dev
```

ローカル開発サーバーが起動します（通常は `http://localhost:5173`）。

### プレビュー（Cloudflare Workers 環境）

```bash
pnpm run preview
```

Wrangler を使用して Cloudflare Workers 環境でプレビューできます。

## ビルド

```bash
pnpm run build
```

クライアントとサーバーの両方をビルドします。

## デプロイ

```bash
pnpm run deploy
```

ビルド後に Cloudflare Workers にデプロイします。

## プロジェクト構造

```
my-hono/
├── app/
│   ├── components/       # 共通コンポーネント
│   │   └── layout.tsx    # レイアウトコンポーネント
│   ├── islands/          # Islands Architecture のクライアントコンポーネント
│   │   └── time.tsx      # 時刻表示コンポーネント（例）
│   ├── lib/              # ユーティリティ・ビジネスロジック
│   │   ├── db.ts         # データベース操作（現在は JSON ファイル）
│   │   ├── repo.ts       # リポジトリパターン（JSON 版）
│   │   ├── repo.d1.ts    # D1 実装予定
│   │   ├── markdown.ts   # Markdown パーサー
│   │   ├── schemas.ts    # Zod スキーマ定義
│   │   └── ...
│   ├── routes/           # ルート定義
│   │   ├── index.tsx     # トップページ
│   │   ├── blogs/        # ブログ関連ルート
│   │   │   ├── index.tsx # 記事一覧
│   │   │   ├── [slug].tsx # 記事詳細
│   │   │   └── create.tsx # 記事作成
│   │   ├── labs/         # 実験的機能
│   │   └── ...
│   ├── client.ts         # クライアントエントリーポイント
│   ├── server.ts         # サーバーエントリーポイント
│   └── style.css         # グローバルスタイル
├── data/
│   └── posts.json        # 記事データ（現在は JSON ファイルで保存）
├── public/               # 静的ファイル
├── package.json
├── vite.config.ts        # Vite 設定
├── wrangler.jsonc        # Cloudflare Workers 設定
└── tsconfig.json         # TypeScript 設定
```

## 主要な機能の説明

### Islands Architecture

`app/islands/` ディレクトリに配置されたコンポーネントは、クライアントサイドでインタラクティブに動作します。例として `time.tsx` が実装されています。

### ルーティング

HonoX のファイルベースルーティングを使用しています。

- `app/routes/index.tsx` → `/`
- `app/routes/blogs/index.tsx` → `/blogs`
- `app/routes/blogs/[slug].tsx` → `/blogs/:slug`
- `app/routes/blogs/create.tsx` → `/blogs/create`

### データ管理

現在は `data/posts.json` を使用してデータを保存しています。将来的には Cloudflare D1（SQLite）への移行を予定しています（`app/lib/repo.d1.ts` にプレースホルダーあり）。

### バリデーション

Zod スキーマと `@hono/zod-validator` を使用してフォームバリデーションを実装しています（`app/routes/blogs/create.tsx` を参照）。

### Markdown パース

Markdoc を使用して Markdown を HTML に変換しています（`app/lib/markdown.ts`）。

## 今後の予定

- [ ] Cloudflare D1 への移行
- [ ] 記事編集機能
- [ ] 記事削除機能
- [ ] 認証機能

## ライセンス

Private
