# PWA アイコンについて

PWA（Progressive Web App）には、ホーム画面に追加した際に表示されるアイコンが必要です。

## 必要なファイル

このディレクトリに以下の2つのPNG画像を配置してください：

- **icon-192.png**: 192x192 ピクセル
- **icon-512.png**: 512x512 ピクセル

## アイコン作成方法

### オプション1: オンラインジェネレーター（簡単）

以下のサイトで簡単に作成できます：

1. **Favicon.io**
   - https://favicon.io/favicon-generator/
   - テキストから自動生成可能

2. **PWA Builder Image Generator**
   - https://www.pwabuilder.com/imageGenerator
   - 1つの画像から全サイズを生成

3. **RealFaviconGenerator**
   - https://realfavicongenerator.net/
   - PWA対応の包括的なアイコン生成

### オプション2: デザインツール

Figma、Canva、Photoshopなどで作成：

**推奨仕様**:
- **サイズ**: 192x192px と 512x512px
- **形式**: PNG（透過なし推奨）
- **背景**: ベタ塗り（iOSでマスク適用されるため）
- **余白**: 端から10%程度の安全領域を確保

## デザインのコツ

### iOS対応

iOSはアイコンに自動でマスク（角丸）を適用するため：
- ✅ 重要な要素は中央に配置
- ✅ 背景色を設定（透過だと白背景になる）
- ❌ 独自の角丸は不要（上書きされる）

### Android対応

- ✅ Adaptive Icon形式も考慮（中央70%が安全領域）
- ✅ 背景とForegroundを分離すると柔軟

### シンプルさ

小さいサイズ（48x48px程度）でも認識できるようシンプルに。

## テスト

アイコンを配置したら：

1. アプリを起動
2. 各デバイスで「ホーム画面に追加」
3. ホーム画面でアイコンが正しく表示されるか確認

## 参考リンク

- [MDN: Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Google: Add a web app manifest](https://web.dev/add-manifest/)

