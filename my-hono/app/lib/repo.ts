// app/lib/repo.ts （今はJSON版。後でD1実装に差し替え）
import fs from 'fs/promises';
import { PostRow } from './types';
import { toSlug } from './slug';

const file = './data/posts.json';

export async function getPostRows(): Promise<PostRow[]> {
  const json = await fs.readFile(file, 'utf-8');
  return JSON.parse(json) as PostRow[];
}

export async function createPostRow(input: { title: string; content: string }): Promise<PostRow> {
  const rows = await getPostRows();
  const now = new Date().toISOString();
  const row: PostRow = {
    id: crypto.randomUUID(),
    slug: toSlug(input.title),
    title: input.title,
    content: input.content,
    created_at: now,
    updated_at: now,
  };
  rows.push(row);
  await fs.writeFile(file, JSON.stringify(rows, null, 2));
  return row;
}
