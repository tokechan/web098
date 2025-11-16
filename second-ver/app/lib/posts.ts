import type { PostFrontmatter, PostModule } from '../types/mdx';
import { toSlug } from './slug';
import { postUrl } from './paths';

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  url: string;
};

export type PostDetail = PostSummary & {
  tags?: string[];
  content: PostModule['default'];
  frontmatter: PostFrontmatter;
};

const modules = import.meta.glob<PostModule>('../content/blog/**/*.mdx', {
  eager: true,
});

const allEntries = Object.entries(modules).map(([path, mod]) => {
  const slug = toSlug(path);
  const frontmatter = mod.frontmatter ?? {};
  return {
    slug,
    frontmatter,
    component: mod.default,
  };
});

const allPosts: PostSummary[] = allEntries
  .map(({ slug, frontmatter }) => ({
    slug,
    title: frontmatter.title ?? '(no title)',
    date: frontmatter.date ?? '',
    description: frontmatter.description ?? '',
    url: postUrl(slug),
  }))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const getRecentPosts = (limit = 3): PostSummary[] =>
  allPosts.slice(0, Math.max(0, limit));

export const getAllPosts = (): PostSummary[] => [...allPosts];

export const getPostBySlug = (slug: string) => {
  const entry = allEntries.find((item) => item.slug === slug);
  if (!entry) return undefined;

  const summary = allPosts.find((post) => post.slug === slug)!;
  return {
    ...summary,
    tags: entry.frontmatter.tags,
    content: entry.component,
    frontmatter: entry.frontmatter,
  } satisfies PostDetail;
};
