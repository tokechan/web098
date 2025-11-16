
/*
 * URL ビルダー関数（暫定実装）
 * TODO:
 * - パスの変更に合わせて修正
 * - ルーティングに依存しないようにする
 * - 不要になれば削除
 */
export const postUrl = (slug: string) => `/blogs/${slug}`;
