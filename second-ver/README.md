# second-ver (ver1)

Honox（Hono + Islands）で構築した実験的ブログ＆ラボサイト。Cloudflare Workers に最適化された SSR/SSG スタックを採用し、音声を MDX に変換する API も同一レポジトリで運用しています。  
この README は ver1（現行構成）の記録です。

---

## 技術スタック

### コアフレームワーク
- **Honox**: `^0.1.49` — Hono ベースの Islands アーキテクチャフレームワーク
- **Hono**: `^4.9.9` — Cloudflare Workers 向け Web フレームワーク
- **Node.js**: 18 以上（開発/ビルド環境）

### ランタイム・デプロイ
- **Cloudflare Workers** — 本番/プレビューの実行環境
- **Wrangler**: `^4.4.0` — Workers/Pages 用 CLI
- **@cloudflare/workers-types**: `^4.20250214.0` — TypeScript 型

### ビルド・開発ツール
- **Vite**: `^6.3.5` — ビルド/開発サーバー
- **@hono/vite-build**: `^1.3.0`
- **@hono/vite-dev-server**: `^0.18.2`
- **@hono/vite-ssg**: `^0.2.0` — SSG 出力
- **@mdx-js/rollup** + **remark-frontmatter** + **remark-mdx-frontmatter** + **rehype-pretty-code** + **shiki** — MDX + シンタックスハイライト

### スタイリング
- **Tailwind CSS**: `^3.4.18`
- カスタムトークン (`app/styles/theme.css`, `app/styles/tokens.ts`) と組み合わせたハイブリッド構成

### その他
- **pnpm**: `10.21.0` — `packageManager` フィールドで固定
- **TypeScript** (tsconfig + `@types/node`)

---

## 機能
- ブログ記事一覧／詳細（MDX frontmatter 解析 + pretty-code）
- Labs セクション（実験プロジェクト紹介）
- `/blog/new/audio` のブラウザ録音 UI（MediaRecorder）と音声→MDX 変換 API  
  ※ API/フロントともに実装途中の実験機能。動作は変わる可能性があります。
- Honox-Islands によるクライアントコンポーネント（時計、カウンターなど）
- ブランドトーン/デザインガイド（docs/design/**）に沿ったテーマ

---

## セットアップ

### 必要環境
- Node.js >= 18
- pnpm 10.21.0（`corepack enable` 推奨）

### インストール
```bash
corepack enable
pnpm install
```

---

## 開発・ビルド・デプロイ

| コマンド | 説明 |
| --- | --- |
| `pnpm dev` | Honox/Vite 開発サーバーを起動（通常 http://localhost:5173）。 |
| `pnpm preview` | Wrangler で Workers プレビュー。`pnpm dev` と別ターミナルで併用。 |
| `pnpm run build` | クライアント + SSR ビルド（`dist/` に出力）。 |
| `pnpm run lint` | ESLint (`app/**/*.{ts,tsx}`) を実行。 |
| `pnpm run deploy` | （当面は `npm run build` を内部呼び出し）Workers へデプロイ ※ルール上、実運用時のみ。 |

> `deploy` スクリプトは AGENT ルールによりまだ `npm run build` をラップしています。pnpm 運用時は必ず先に `pnpm run build` を実行してください。

---

## プロジェクト構造

```
second-ver/
├── app/
│   ├── components/            # atoms / molecules / organisms / templates
│   │   └── organisms/$AudioBlogRecorder.tsx
│   ├── content/               # MDX (blog, home hero, etc.)
│   ├── lib/                   # posts.ts, labs.ts, audioBlogClient.ts など
│   ├── routes/                # /, /blogs, /labs, /blog/new/audio ...
│   ├── styles/                # theme.css, tokens.ts, prose.ts
│   └── Layout.tsx, client.ts, server.ts
├── docs/
│   ├── design/identity.md / tone-style.md / monetization.md
│   └── tech-note/refactoring-posts.md / audio-blog-worker.md / pnpm-migration.md
├── src/features/
│   ├── audio-blog/worker.ts   # Cloudflare Worker (音声→MDX API)
│   └── hooks/useTimer.ts      # 共有 Hooks
├── public/                    # favicon など
├── package.json               # scripts, deps, packageManager=pnpm@10.21.0
├── pnpm-lock.yaml / pnpm-workspace.yaml
├── vite.config.ts             # Honox + MDX + pretty-code 設定
├── wrangler.jsonc             # メイン Worker + /api/audio-blog ルート設定
├── wrangler.audio-blog.jsonc  # 音声 Worker 単体実行用
└── tsconfig.json / tailwind.config.cjs / eslint.config.mjs / postcss.config.cjs
```

---

## 音声ブログワークフロー
1. `/blog/new/audio` に配置した `$AudioBlogRecorder` が MediaRecorder API で音声取得。
2. `app/lib/audioBlogClient.ts` が `/api/audio-blog` に multipart POST。
3. `src/features/audio-blog/worker.ts` が `OPENAI_API_KEY` を参照して
   - `gpt-4o-transcribe` で文字起こし
   - `gpt-4o-mini` で MDX（frontmatter + 本文）を生成
4. フロントで MDX プレビュー＆ `.mdx` ダウンロード。

---

## コンテンツ / デザインガイド
- ブランド軸・トーン: `docs/design/identity.md`, `docs/design/tone-style.md`
- 収益化/公開戦略: `docs/design/monetization.md`
- MDX データ共通化の経緯: `docs/tech-note/refactoring-posts.md`

---

## 検証手順（ローカル）
1. `pnpm run lint` → `pnpm run build` が成功すること。
2. 2ターミナルで `pnpm dev` と `pnpm preview`（= Wrangler dev）を起動。
3. ブラウザで `http://localhost:<vite-port>/` `.../blogs` `.../labs` を確認。
4. `.../blog/new/audio` で録音 → 変換 → ダウンロードの一連操作を行い、MDX プレビューが得られること。

---

## 今後の TODO
- Labs 用 MDX コンテンツの追加
- Tailwind ユーティリティの整理（tokens との役割分担）
- Cloudflare D1 / KV など永続化レイヤーの検討

---

## 注意事項
- `.env` やシークレットの編集禁止。`OPENAI_API_KEY` は Wrangler `secret put` を人間が実行。
- Cloudflare への本番デプロイは明示的な許可がある場合のみ。通常は `pnpm preview` で挙動確認する。
- 破壊的操作（`rm`, `mv`, `git reset --hard` など）はルール上不可。
