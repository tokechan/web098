export type PostRow = {
  // DBの「生」データ（D1のスキーマに一致）
  id: string;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type PostSummary = {
  // UIカード表示など“一覧”用
  slug: string;
  title: string;
  excerpt?: string;
};

export type PostDetail = {
  // 記事詳細ページ用
  slug: string;
  title: string;
  content: string;
  createdAt: string; // UIで使いやすい名前に整形してOK
  updatedAt: string;
};
