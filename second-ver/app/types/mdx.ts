import type { FC } from 'hono/jsx';

export type PostFrontmatter = {
  title?: string;
  date?: string;
  tags?: string[];
  description?: string;
};

export type PostModule = {
  frontmatter?: PostFrontmatter;
  default: FC;
};
