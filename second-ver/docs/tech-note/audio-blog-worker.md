# Audio Blog Worker Routing

セットアップを実行する人向けのメモです。音声ブログ API はメイン Worker とは別プロジェクトとして運用します。

## 1. Wrangler 設定

1. `wrangler.audio-blog.jsonc` を開き、`routes` の `pattern` と `zone_name` を実際のドメインに差し替える。  
   例) `pattern: "example.com/api/audio-blog*"`、`zone_name: "example.com"`
2. ローカル開発時は `wrangler dev --config wrangler.audio-blog.jsonc` を実行する。デフォルトでポート 8788 を使う。

## 2. シークレット

1. 初回のみ `wrangler --config wrangler.audio-blog.jsonc secret put OPENAI_API_KEY` を実行し、OpenAI API キーを登録する。
2. Worker 内では `env.OPENAI_API_KEY` として参照できる。

## 3. デプロイ

1. 本番環境に公開する場合は `wrangler deploy --config wrangler.audio-blog.jsonc` を実行する。
2. Cloudflare 側のルート設定 (例: `example.com/api/audio-blog*`) が完了していることを確認する。

この構成でメインアプリとは独立した Worker として音声変換 API を起動・運用できます。
