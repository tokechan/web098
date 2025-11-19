# pnpm への移行メモ

最終更新: 2025-11-17

## 概要
- 依存管理を npm から pnpm に切り替えた。
- ルートに `pnpm-lock.yaml` と `pnpm-workspace.yaml` を追加し、`package-lock.json` は廃止。
- `package.json` に `packageManager: "pnpm@10.21.0"` を明示して、Corepack でのバージョン固定を推奨。

## セットアップ手順
1. `corepack enable` を実行して pnpm を有効化。
2. ルートで `pnpm install` を実行。
3. 開発サーバーは `pnpm dev`、ビルドは `pnpm run build`、Lint は `pnpm run lint` を使用。
4. Worker のローカル検証は `pnpm preview`（= `wrangler dev`）＋ `pnpm dev` の2ターミナル構成でこれまで通り。

## モノレポ準備
- `pnpm-workspace.yaml` には `.` `apps/*` `packages/*` を定義。将来パッケージを増やす際は対応ディレクトリを作るだけで良い。
- 既存の Honox アプリも Workspace 内に含まれるため追加設定は不要。

## 検証フロー
- `pnpm install && pnpm run lint && pnpm run build` が通ることを確認する。
- その後 `pnpm dev` で Vite/Honox サーバーを起動し、別ターミナルで `pnpm preview` を実行して Worker 側を検証。
- `/blog/new/audio` で録音→変換→ダウンロードの一連の動作が行えるか再確認する。

## 備考
- `deploy` スクリプト内の `npm run build` 呼び出しは現状維持（AGENTルールにより scripts 変更不可）。pnpm 利用時は手動で `pnpm run build` を先に実行してから `pnpm run deploy` を使う。
- 追加のパッケージを入れる際は `pnpm add <pkg>` / `pnpm add -D <pkg>` を必ず利用する。
