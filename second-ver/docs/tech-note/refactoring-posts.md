# Refactoring: Posts データの共通化

## 背景
- `/blogs` と `/blogs/[slug]` で `import.meta.glob` を二重に実行しており、MDX 読み込みロジックが重複していた。
- frontmatter 整形・slug 解決が各ルートに散らばっていたため、仕様変更時の同期漏れリスクが高かった。

## 対応概要（2025-11-16）
1. `app/types/mdx.ts` を追加して frontmatter 型 `PostFrontmatter` / `PostModule` を共通化。
2. `app/lib/posts.ts`
   - `allEntries` キャッシュ＋ `PostDetail` 型を導入。
   - `getPostBySlug(slug)` を追加し、一覧・詳細が同じソースを参照するようにした。
3. `app/routes/blogs/[slug].tsx` は `getPostBySlug` を利用する構成へ置き換え。slug探索/MDX読込の重複ロジックを排除。

## 効果
- import.meta.glob を1回に統合できたため、ビルド時の無駄を削減。
- Post データの取得入口が `lib/posts.ts` に一本化され、コード変更時の影響範囲が明確になった。
- 今後ブログ機能を拡張（メタ情報追加、slug 変更など）しても、ライブラリ側を直すだけでルート全体に反映される。
