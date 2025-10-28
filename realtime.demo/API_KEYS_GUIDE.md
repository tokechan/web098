# Supabase API Keys ガイド

Supabaseには**新旧2つのAPI Key方式**があります。このガイドでは両方の使い方を説明します。

## 🆕 新方式（推奨）: API Keys

Supabase Dashboard > Settings > API > **API Keys** タブ

### Publishable key（公開鍵）

```
sb_publishable_xxxxx...
```

**用途**: フロントエンド（ブラウザ）で使用

- ✅ 公開しても安全（Gitにコミット可能）
- ✅ Row Level Security（RLS）が適用される
- ✅ ユーザー認証と組み合わせて使用
- 📱 Next.js、React、Vue等のフロントエンドで使用

**対応する変数名**:
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx...
```

※ 変数名は `ANON_KEY` のままでOK（互換性のため）

### Secret key（秘密鍵）

```
sb_secret_xxxxx...
```

**用途**: バックエンド（サーバー）で使用

- ❌ 絶対に公開しない（環境変数で管理）
- ❌ Gitにコミットしない
- ✅ Row Level Security（RLS）をバイパス可能
- 🔒 Hono BFF、Cloudflare Workers等のサーバーで使用

**対応する変数名**:
```bash
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx...
```

※ 変数名は `SERVICE_ROLE_KEY` のままでOK（互換性のため）

---

## 🔄 旧方式: Legacy API Keys

Supabase Dashboard > Settings > API > **Legacy API Keys** タブ

### anon key（公開鍵）

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**用途**: フロントエンド（ブラウザ）で使用

- ✅ 公開しても安全
- ✅ Row Level Security（RLS）が適用される
- 📱 フロントエンドで使用

**対応する変数名**:
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### service_role key（秘密鍵）

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**用途**: バックエンド（サーバー）で使用

- ❌ 絶対に公開しない
- ❌ Gitにコミットしない
- ✅ RLSをバイパス可能
- 🔒 サーバーサイドで使用

**対応する変数名**:
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## 🤔 どちらを使うべきか？

### 新しいプロジェクト

✅ **API Keys（Publishable key + Secret key）を推奨**

理由：
- Supabaseの推奨方式
- キー形式が明確（`sb_publishable_`, `sb_secret_`）
- 将来的に Legacy API Keys は廃止予定

### 既存プロジェクト

✅ **Legacy API Keys でも動作します**

理由：
- 既存のプロジェクトはそのまま使用可能
- 移行は任意（急ぐ必要なし）
- 機能は完全に同じ

---

## 📋 このテンプレートでの使用例

### Frontend (`.env.local`)

**新方式**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx...
NEXT_PUBLIC_BFF_URL=http://localhost:8787
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJxxxxx...
```

**旧方式**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_BFF_URL=http://localhost:8787
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJxxxxx...
```

### BFF (`.dev.vars`)

**新方式**:
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx...
VAPID_PUBLIC_KEY=BJxxxxx...
VAPID_PRIVATE_KEY=abcdef...
VAPID_MAILTO=mailto:you@example.com
```

**旧方式**:
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
VAPID_PUBLIC_KEY=BJxxxxx...
VAPID_PRIVATE_KEY=abcdef...
VAPID_MAILTO=mailto:you@example.com
```

---

## 🔐 セキュリティのベストプラクティス

### ✅ やるべきこと

1. **Secret key / service_role key は環境変数で管理**
   ```bash
   # .gitignore に追加
   .env.local
   .dev.vars
   ```

2. **本番環境では別のキーを使用**
   - 開発環境と本番環境でキーを分ける
   - 本番用は Vercel / Cloudflare Dashboard で設定

3. **RLSポリシーを適切に設定**
   ```sql
   CREATE POLICY "Users can only access their own data"
     ON messages FOR ALL
     USING (auth.uid()::text = user_id);
   ```

### ❌ やってはいけないこと

1. **Secret key / service_role key をフロントエンドで使用**
   - ブラウザに露出してはいけない
   - DevToolsで見られてしまう

2. **Secret key / service_role key をGitにコミット**
   - GitHub等に公開されると悪用される
   - 即座に再生成が必要

3. **Publishable key / anon key でRLSをバイパスしようとする**
   - 不可能（設計上）
   - サーバーサイドで適切に処理する

---

## 🔄 キーの移行（旧 → 新）

### 必要？

- **必須ではありません**
- Legacy API Keys は当面使用可能
- 新しいプロジェクトでは新方式を推奨

### 移行手順

1. Supabase Dashboard > Settings > API > **API Keys** タブ
2. Publishable key と Secret key をコピー
3. 環境変数ファイルを更新（変数名はそのまま）
   ```bash
   # 変数名は変更不要
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx...
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx...
   ```
4. アプリを再起動して動作確認

---

## 🆘 トラブルシューティング

### エラー: "Invalid API key"

- キーが正しくコピーされているか確認
- 環境変数名が正しいか確認
- `.env.local` を作成したか確認
- アプリを再起動したか確認

### エラー: "Row Level Security policy violation"

- RLSポリシーが正しく設定されているか確認
- フロントエンドで Secret key を使っていないか確認
- 認証が必要な場合、ログインしているか確認

### 新旧のキーが混在している

- **問題ありません**
- フロントエンドとBFFで異なる方式でもOK
- 機能は完全に同じ

---

## 📚 参考リンク

- [Supabase Docs: API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Supabase Docs: Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Docs: Server-side Auth](https://supabase.com/docs/guides/auth/server-side)

