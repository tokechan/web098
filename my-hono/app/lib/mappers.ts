import { PostRow, PostSummary, PostDetail } from './types';

export const toSummary = (row: PostRow): PostSummary => ({
  slug: row.slug,
  title: row.title,
  excerpt: row.content.slice(0, 120), // 適当に要約
});

export const toDetail = (row: PostRow): PostDetail => ({
  slug: row.slug,
  title: row.title,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
