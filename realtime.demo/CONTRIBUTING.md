# コントリビューションガイド

このプロジェクトへの貢献を歓迎します！

## 開発環境

### 必要なもの

- Node.js 18+
- npm または pnpm
- Supabaseアカウント（無料）
- Git

### セットアップ

1. リポジトリをクローン（またはFork）
2. `SETUP.md` に従って環境構築
3. 動作確認

```bash
# BFF
cd bff && npm run dev

# Frontend
cd frontend && npm run dev
```

## 貢献方法

### バグ報告

**Issue** を作成してください。以下の情報を含めると助かります：

- 環境（OS、ブラウザ、バージョン）
- 再現手順
- 期待する動作
- 実際の動作
- エラーメッセージ（あれば）

### 機能提案

**Issue** で機能提案を歓迎します。

以下を含めてください：

- 解決したい課題
- 提案する機能
- 代替案（あれば）

### Pull Request

1. **Fork** してブランチ作成
   ```bash
   git checkout -b feature/awesome-feature
   ```

2. **変更を実装**
   - コードは読みやすく
   - コメントは日本語でOK
   - 型安全を保つ

3. **テスト**
   - 手動で動作確認
   - 既存機能が壊れていないか確認

4. **コミット**
   ```bash
   git commit -m "feat: awesome feature"
   ```

   コミットメッセージは以下の形式推奨：
   - `feat:` 新機能
   - `fix:` バグ修正
   - `docs:` ドキュメント
   - `refactor:` リファクタリング
   - `chore:` その他

5. **Push & PR作成**
   ```bash
   git push origin feature/awesome-feature
   ```

## 拡張アイデア

以下のような機能追加を歓迎します：

### 認証機能

- Supabase Authによるユーザー認証
- ソーシャルログイン（Google、GitHub等）

### 通知機能の強化

- 通知のカテゴリ分け
- 通知設定UI（オン/オフ、頻度）
- 通知履歴

### UI/UX改善

- ダークモード
- アニメーション
- オンボーディング

### BFF機能追加

- Rate limiting（レート制限）
- 監査ログ
- Cloudflare Queues による再送
- Cron による定期通知

### デプロイ・CI/CD

- GitHub Actions
- 自動テスト
- デプロイスクリプト

### ドキュメント

- 英語版README
- API仕様書
- チュートリアル動画

## コードスタイル

### TypeScript

- 型は明示的に（`any` は避ける）
- 関数には戻り値の型を指定
- `const` を優先、`let` は必要な時のみ

### React/Next.js

- 関数コンポーネント優先
- Hooksを活用
- Server ComponentとClient Componentを適切に使い分け

### Hono

- ルートハンドラは簡潔に
- バリデーションは必ず実施（Zod）
- エラーハンドリングを適切に

## 質問・相談

わからないことがあれば **Issue** で質問してください！

## ライセンス

貢献されたコードは MIT ライセンスで公開されます。

