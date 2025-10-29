# Changelog

このプロジェクトの変更履歴を記録します。

## [0.1.0] - 2025-10-28

### 🔁 2025-10-29 リファイン

- **FCM Web Push**
  - Firebase JS SDK を 10.13.0 に更新し、Service Worker を `firebase-messaging-sw.js` に統一。
  - FCM v1 ペイロードを `notification + webpush` 中心に再構成し、`data.url` と `fcm_options.link` を設定。
  - `/api/notify` エンドポイントを追加し、任意トークンへの通知トリガーを提供。
  - Frontend 側で送信リンクを絶対 URL で渡すよう統一。
- **Supabase Realtime**
  - `user_id` 単位の差分購読ロジックを導入し、メッセージ一覧を即時更新。
  - フィード切り替え UI を追加して複端末検証をしやすく。
- **ドキュメント**
  - README / ARCHITECTURE / PROGRESS を更新し、検証手順と通知経路を明記。

### 🎉 初回リリース

#### 追加

- **Frontend (Next.js PWA)**
  - PWA基盤（manifest.json, Service Worker）
  - Web Push購読管理
  - Supabase Realtime接続
  - メッセージ送受信UI
  - 通知許可リクエストUI
  - PWAモード検出（A2HS判定）

- **BFF (Hono on Cloudflare Workers)**
  - Web Push送信（VAPID）
  - Push購読の保存
  - Supabase Service Role連携
  - Zodバリデーション
  - CORS設定
  - テスト通知API
  - 「ありがとう」API（実例）

- **Supabase**
  - `messages` テーブル（Realtime有効）
  - `push_subscriptions` テーブル
  - RLSポリシー（開発用）
  - インデックス最適化

- **ドキュメント**
  - README.md - プロジェクト概要
  - QUICKSTART.md - 5分で動かすガイド
  - SETUP.md - 詳細セットアップガイド
  - ARCHITECTURE.md - アーキテクチャ解説
  - PROJECT_STRUCTURE.md - ファイル構成
  - CONTRIBUTING.md - コントリビューションガイド
  - CHANGELOG.md - このファイル

#### 対応プラットフォーム

- ✅ iOS 16.4+ (Safari, A2HS必須)
- ✅ Android (Chrome, Firefox)
- ✅ Desktop (Chrome, Edge, Firefox, Safari)

---

## 今後の予定

### v0.2.0（計画中）

- [ ] ユーザー認証（Supabase Auth）
- [ ] 本番用RLSポリシー
- [ ] Rate limiting
- [ ] 監査ログ

### v0.3.0（計画中）

- [ ] 通知設定UI
- [ ] 通知履歴
- [ ] ダークモード
- [ ] Cloudflare Queues統合

### バックログ

- [ ] 英語版ドキュメント
- [ ] GitHub Actions CI/CD
- [ ] E2Eテスト
- [ ] パフォーマンス最適化
- [ ] 通知のカテゴリ分け
- [ ] プッシュ通知の配信統計
- [ ] Cron定期通知（朝のまとめ等）

---

フォーマット参考: [Keep a Changelog](https://keepachangelog.com/)
