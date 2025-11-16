import type { PostFrontmatter, PostModule } from '../types/mdx';
import { toSlug } from './slug';
import { labUrl } from './paths';

export type LabSummary = {
  slug: string;
  title: string;
  summary: string;
  tags?: string[];
  status?: string;
  url: string;
  date?: string;
};

const modules = import.meta.glob<PostModule>('../content/labs/**/*.mdx', {
  eager: true,
});

const entries = Object.entries(modules).map(([path, mod]) => {
  const slug = mod.frontmatter?.slug ?? toSlug(path);
  const frontmatter: PostFrontmatter = mod.frontmatter ?? {};
  return {
    slug,
    frontmatter,
    component: mod.default,
  };
});

export const getAllLabs = (): LabSummary[] =>
  entries.map(({ slug, frontmatter }) => ({
    slug,
    title: frontmatter.title ?? '(no title)',
    summary: frontmatter.summary ?? '',
    tags: frontmatter.tags,
    status: frontmatter.status,
    date: frontmatter.date,
    url: labUrl(slug),
  }));

export const getLabBySlug = (slug: string) => {
  const entry = entries.find((item) => item.slug === slug);
  if (!entry) return undefined;

  return {
    slug: entry.slug,
    frontmatter: entry.frontmatter,
    component: entry.component,
    summary: entry.frontmatter.summary ?? '',
    url: labUrl(entry.slug),
  };
};
