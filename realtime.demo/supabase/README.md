# Supabase セットアップ

## 1. プロジェクト作成

[Supabase](https://supabase.com) でプロジェクトを作成します。

## 2. スキーマ実行

`schema.sql` をSupabase SQL Editorで実行します。

1. Supabase Dashboard を開く
2. 左メニューから「SQL Editor」を選択
3. `schema.sql` の内容を貼り付け
4. 「RUN」をクリック

## 3. Realtime有効化

### 方法1: Table Editor から（推奨）

1. Supabase Dashboard > **Table Editor** を開く
2. `messages` テーブルを選択
3. 上部の「**Enable Realtime**」ボタンをクリック
4. 確認ダイアログで「**Enable realtime**」をクリック

### 方法2: Replication から（旧バージョン）

1. Supabase Dashboard > Database > **Replication** を開く
2. `messages` テーブルの **Realtime** を **ON** にする

※ プロジェクトによっては Replication メニューがない場合があります。

## 4. 環境変数取得

以下の情報を取得してください：

`Settings` > `API` を開く

### Project URL

例: `https://xxxxx.supabase.co`

### API Keys

Supabaseには新旧2つのAPI Key方式があります：

#### 新方式（推奨）: API Keys タブ

- **Publishable key**: フロントエンドで使用（公開可能、旧 anon key と同等）
- **Secret key**: BFFで使用（秘密鍵、絶対に公開しない、旧 service_role key と同等）

#### 旧方式: Legacy API Keys タブ

- **anon key**: フロントエンドで使用（公開可能）
- **service_role key**: BFFで使用（秘密鍵、絶対に公開しない）

**どちらを使う？**

- 新しいプロジェクト → **API Keys（Publishable key）を推奨**
- 既存プロジェクト → Legacy API Keys でも動作します

機能は同じですが、将来的に Legacy API Keys は廃止予定です。

## 5. RLS（Row Level Security）設定

**重要**: 本番環境では必ず適切なRLSポリシーを設定してください。

現在のスキーマは開発用に全ユーザーが全データにアクセス可能な設定です。

### 本番用のRLS例

```sql
-- messagesテーブル: 自分のメッセージのみ削除可能
DROP POLICY "Allow all for messages" ON messages;

CREATE POLICY "Anyone can read messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own messages" ON messages
  FOR DELETE USING (auth.uid()::text = user_id);

-- push_subscriptionsテーブル: 自分の購読のみ管理可能
DROP POLICY "Allow all for push_subscriptions" ON push_subscriptions;

CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid()::text = user_id);
```

## テーブル構成

### messages

リアルタイムメッセージの保存用

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | 主キー |
| user_id | TEXT | ユーザーID |
| content | TEXT | メッセージ内容 |
| created_at | TIMESTAMP | 作成日時 |

### push_subscriptions

Web Push購読情報の保存用

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | 主キー |
| user_id | TEXT | ユーザーID（ユニーク） |
| endpoint | TEXT | Push endpoint |
| p256dh | TEXT | 公開鍵 |
| auth | TEXT | 認証シークレット |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

