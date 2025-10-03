import fs from 'fs/promises';

export type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export const createPost = async ({
  title,
  content,
}: Pick<Post, 'title' | 'content'>) => {
  const articlesJSON = await fs.readFile('./data/posts.json', {
    encoding: 'utf-8',
  });
  const posts: Post[] = JSON.parse(articlesJSON);
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  const updated_at = created_at;
  const post: Post = { id, title, content, created_at, updated_at };
  posts.push(post);
  await fs.writeFile('./data/posts.json', JSON.stringify(posts));

  return post;
};

export const getPosts = async () => {
  const postsJSON = await fs.readFile('./data/posts.json', {
    encoding: 'utf-8',
  });
  return JSON.parse(postsJSON) as Post[];
};
