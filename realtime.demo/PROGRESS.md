# PWA × FCM (Firebase Cloud Messaging) プッシュ通知 検証プロジェクト - 進捗状況

**最終更新**: 2025-10-29

---

## 📝 2025-10-29 アップデート
- Frontend (`frontend/app/page.tsx`) のメッセージ送信は BFF の `/api/thanks` 経由に統一。Supabase への書き込みと FCM Push が 1 リクエストで走ります。
- Realtime 購読は `user_id` ごとにフィルタし、受信ユーザーのメッセージだけを即時反映します。
- `frontend/lib/push.ts` で BFF 経由の送信内容をログに残すようにし、原因調査に必要な最低限の情報を出力します。
- iPhone PWA 手動検証手順を追記。ホーム追加後に Push を受け取りながら、BFF `wrangler tail` と Frontend/Service Worker のコンソールで状況を確認できます。
- BFF に汎用通知エンドポイント `/api/notify` を追加し、Service Account で安全に FCΜ へ通知を送れるようにしました。

### ✅ 再現手順（iPhone Safari 16.4+）
1. `https://pwa-push-demo-frontend.fleatoke.workers.dev` を Safari で開き、画面右上の共有メニューから **ホーム画面に追加**。
2. ホームから PWA を起動し、表示される **User ID** をメモ（別端末へ送る場合は共有）。
3. 「Push通知を有効化」をタップし、通知権限を付与 → 成功アラートが出ることを確認。
4. 送信先を自分の User ID（デフォルト設定済み）または別端末の User ID に設定し、メッセージを送信。
5. 画面を閉じる/バックグラウンドにした状態でも通知が届くことを確認。開いている間はメッセージ一覧が即座に更新される。
6. ログ取得:
   - BFF: `cd bff && npx wrangler tail --format pretty`
   - Frontend: Safari の Web Inspector → Console
   - Service Worker: Web Inspector → Resources → Service Workers → Console
   - BFF 汎用通知テスト: `curl -X POST https://pwa-push-demo-bff.fleatoke.workers.dev/api/notify -H "Content-Type: application/json" -d '{"token":"<FCM_TOKEN>","title":"チェック","body":"BFF経由テスト","link":"https://pwa-push-demo-frontend.fleatoke.workers.dev"}'`

- Safari で通知が届かない場合は、ホーム追加をやり直し、通知権限が `granted` になっているかを UI で確認してください。

---

## ✅ 完了している部分

### 1. ローカル環境での動作確認
- ✅ **Service Worker の登録**: 成功
- ✅ **FCM トークンの取得**: 成功
- ✅ **Supabase への FCM トークン保存**: 成功
- ✅ **DevTools から直接 Push テスト**: 成功（通知表示確認済み）
- ✅ **BFF → FCM への送信**: ローカルで成功（`200 OK`）

### 2. デプロイ済み
- ✅ **BFF**: `https://pwa-push-demo-bff.fleatoke.workers.dev`
- ✅ **Frontend**: `https://pwa-push-demo-frontend.fleatoke.workers.dev`

---

## 🚨 現在の問題

### 問題1: BFF の環境変数エラー（最優先）

**エラーログ**:
```
[FCM] Send error: TypeError: Cannot read properties of undefined (reading 'replace')
```

**原因**:
- BFF にデプロイした際、`FCM_PRIVATE_KEY` などの環境変数（Secret）が設定されていない
- `bff/src/index.ts` の `getAccessToken()` 関数で `env.FCM_PRIVATE_KEY.replace()` を呼び出す際に undefined エラー

**関連ファイル**:
- `bff/src/index.ts` (89-131行目: `getAccessToken` 関数)
- `bff/.dev.vars` (ローカル環境変数、**Git に含めない**)

---

### 問題2: Service Worker ファイルが古い

**現象**:
- デプロイ後の Service Worker が `sw.js`（古いファイル）を参照
- 本来は `firebase-messaging-sw.js` であるべき

**原因**:
- Next.js / OpenNext のビルドキャッシュに古いファイルが残っている可能性

**関連ファイル**:
- `frontend/public/firebase-messaging-sw.js` (正しいファイル)
- `frontend/lib/push.ts` (23行目: Service Worker 登録パス)

---

## 🔧 次にやるべきこと

### ステップ1: BFF の環境変数（Secret）を設定

BFF に以下の環境変数を設定する必要があります：

```bash
cd /Users/yutatokeshi/Develop/web098/realtime.demo/bff

# 1. 現在設定されているシークレットを確認
npx wrangler secret list

# 2. 以下のシークレットを設定（未設定の場合）
# FCM Project ID
echo "pwa-push-demo-5a61e" | npx wrangler secret put FCM_PROJECT_ID

# FCM Client Email
echo "firebase-adminsdk-fbsvc@pwa-push-demo-5a61e.iam.gserviceaccount.com" | npx wrangler secret put FCM_CLIENT_EMAIL

# FCM Private Key（改行を含むので手動入力）
npx wrangler secret put FCM_PRIVATE_KEY
# ↑ 実行後、bff/.dev.vars の FCM_PRIVATE_KEY の値（-----BEGIN PRIVATE KEY----- から -----END PRIVATE KEY----- まで）をコピー＆ペースト

# Supabase URL
echo "https://qcxnwhfmfskaqxryzptz.supabase.co" | npx wrangler secret put SUPABASE_URL

# Supabase Service Role Key
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# ↑ 実行後、bff/.dev.vars の SUPABASE_SERVICE_ROLE_KEY の値をコピー＆ペースト
```

**参考値の場所**:
- `bff/.dev.vars` ファイル（ローカル環境変数、**コミットしないこと**）

---

### ステップ2: Frontend を完全にクリーンビルド＆再デプロイ

```bash
cd /Users/yutatokeshi/Develop/web098/realtime.demo/frontend

# 1. ビルドキャッシュを完全削除
rm -rf .next .open-next node_modules/.cache

# 2. 再ビルド＆デプロイ
npm run deploy
```

**確認ポイント**:
- デプロイ後、DevTools → Application → Service Workers で **Source が `firebase-messaging-sw.js` になっているか**

---

### ステップ3: 動作確認

1. **BFF のログを監視**:
   ```bash
   cd /Users/yutatokeshi/Develop/web098/realtime.demo/bff
   npx wrangler tail --format pretty
   ```

2. **Frontend でテスト**:
   - `https://pwa-push-demo-frontend.fleatoke.workers.dev` を開く
   - 「Push通知を有効化」ボタンをクリック
   - 「テスト通知を送信」ボタンをクリック

3. **期待される BFF ログ**:
   ```
   [FCM] Sending to endpoint: https://fcm.googleapis.com/v1/projects/...
   [FCM] Response status: 200
   [FCM] Notification sent successfully
   ```

4. **期待される Frontend Console ログ**:
   ```
   [SW] ===== PUSH EVENT RECEIVED =====
   [SW] Showing notification from push event
   [FCM] Foreground message received:
   ```

---

## 📂 重要なファイル一覧

### BFF (Cloudflare Workers)
- **メイン**: `bff/src/index.ts`
- **設定**: `bff/wrangler.toml`
- **ローカル環境変数**: `bff/.dev.vars` (**Git 管理外**)

### Frontend (Next.js + Cloudflare Pages)
- **Service Worker**: `frontend/public/firebase-messaging-sw.js`
- **FCM 初期化**: `frontend/lib/firebase.ts`
- **Push 通知ロジック**: `frontend/lib/push.ts`
- **UI**: `frontend/app/page.tsx`
- **設定**: `frontend/next.config.js`, `frontend/wrangler.toml`

### Supabase
- **テーブル**: `fcm_tokens` (user_id, fcm_token)
- **スキーマ**: `supabase/schema.sql`

---

## 🔍 デバッグ方法

### BFF のログを確認
```bash
cd /Users/yutatokeshi/Develop/web098/realtime.demo/bff
npx wrangler tail --format pretty
```

### Service Worker のコンソールを確認
1. DevTools → **Application** タブ → **Service Workers**
2. または、**Console** タブ → 上部のドロップダウンから `firebase-messaging-sw.js` を選択

### DevTools から直接 Push テスト
1. DevTools → **Application** → **Service Workers**
2. **Push** セクションに以下を入力:
   ```json
   {"data":{"title":"テスト","body":"これはテストです","url":"/"}}
   ```
3. **Push** ボタンをクリック
4. Console にログが出て、通知が表示されれば Service Worker は正常動作

---

## 📚 参考リソース

### Firebase (FCM)
- **プロジェクト**: `pwa-push-demo-5a61e`
- **Console**: https://console.firebase.google.com/project/pwa-push-demo-5a61e
- **Service Account JSON**: `~/Downloads/pwa-push-demo-5a61e-firebase-adminsdk-fbsvc-4f5b78a092.json`

### Supabase
- **プロジェクト**: `qcxnwhfmfskaqxryzptz`
- **URL**: `https://qcxnwhfmfskaqxryzptz.supabase.co`
- **Dashboard**: https://supabase.com/dashboard/project/qcxnwhfmfskaqxryzptz

### Cloudflare
- **Workers Dashboard**: https://dash.cloudflare.com/
- **BFF**: `pwa-push-demo-bff`
- **Frontend**: `pwa-push-demo-frontend`

---

## 💡 トラブルシューティング

### 「通知が表示されない」場合
1. **macOS の通知設定を確認**: システム環境設定 → 通知 → Chrome/Safari
2. **Service Worker のログを確認**: `[SW] ===== PUSH EVENT RECEIVED =====` が出ているか
3. **BFF のログを確認**: `[FCM] Notification sent successfully` が出ているか

### 「500 Internal Server Error」が出る場合
- BFF の環境変数（Secret）が設定されていない可能性
- `npx wrangler secret list` で確認

### 「Service Worker が古い」場合
- DevTools → Application → Service Workers → **Unregister**
- ページを完全リロード（Cmd + Shift + R）

---

## 🎯 最終目標

- ✅ デスクトップ（Chrome）での通知動作
- ⏳ **iOS PWA での通知動作**（FCM を使用）

---

**次回作業時**: まず「ステップ1: BFF の環境変数を設定」から始めてください！
