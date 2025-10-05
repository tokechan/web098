import { createRoute } from 'honox/factory';
import { css } from 'hono/css';
import { prose } from '../../styles/prose';
import type { FC } from 'hono/jsx';
import { toSlug } from '../../lib/slug';

type PostMod = {
  frontmatter?: {
    title?: string;
    date?: string;
    tags?: string[];
    description?: string;
  };
  default: FC;
};

const pageWrap = css`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-5);
`;

const meta = css`
  color: var(--color-muted);
  font-size: 0.875rem;
  margin-bottom: var(--space-3);
`;

const tagList = css`
  display: flex;
  gap: 0.4rem 0.6rem;
  flex-wrap: wrap;
  margin-top: var(--space-3);
`;

const tag = css`
  font-size: 0.875rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid rgb(139, 250, 35);
  border-radius: 0.35rem;
`;

const modules = import.meta.glob<PostMod>('../../content/blog/**/*.mdx', {
  eager: true,
});


export default createRoute(async (c) => {
  const slug = c.req.param('slug');

  const match = Object.entries(modules).find(([path]) => toSlug(path) === slug);
  if (!match) {
    console.warn('MDX not found for slug', slug, Object.keys(modules));
    return c.notFound();
  }

  const [, mod] = match;
  const Article = mod.default;
  const fm = mod.frontmatter ?? {};

  return c.render(
    <main class={pageWrap}>    
      <header>
        <h1>{fm.title ?? '(no title)'}</h1>
        <div class={meta}>
          {fm.date && <time dateTime={fm.date}>{fm.date}</time>}
          {fm.description && <div>{fm.description}</div>}
          {fm.tags && fm.tags.length > 0 && (
            <div class={tagList}>
              {fm.tags.map((t) => (
                <span class={tag} key={t}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </header>
    
      <article class={prose}>
        <Article />
      </article>
    </main>
  );
});
