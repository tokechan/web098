import type { FC } from 'hono/jsx';
import { postUrl } from './paths';
import { toSlug } from './slug';

type PostModule = {
  frontmatter?: {
    title?: string;
    date?: string;
    tags?: string[];
    description?: string;
  };
  default: FC;
};

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  url: string;
};

const modules = import.meta.glob<PostModule>('../content/blog/**/*.mdx', {
  eager: true,
});

const allPosts: PostSummary[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = toSlug(path);
    const title = mod.frontmatter?.title ?? '(no title)';
    const date = mod.frontmatter?.date ?? '';
    const description = mod.frontmatter?.description ?? '';

    return {
      slug,
      title,
      date,
      description,
      url: postUrl(slug),
    };
  })
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const getRecentPosts = (limit = 3): PostSummary[] =>
  allPosts.slice(0, Math.max(0, limit));

export const getAllPosts = (): PostSummary[] => [...allPosts];
