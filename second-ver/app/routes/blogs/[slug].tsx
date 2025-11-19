import { createRoute } from 'honox/factory';
import { css } from 'hono/css';
import { prose } from '../../styles/prose';
import { getPostBySlug } from '../../lib/posts';

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
  padding: 0.2rem 0.6rem;
  border-radius: 0.35rem;
  background: rgba(63, 112, 77, 0.1); /* Blogs ナビ背景に合わせた淡グリーン */
  color: var(--color-accent);
  border: 1px solid rgba(63, 112, 77, 0.18);
`;

export default createRoute(async (c) => {
  const slug = c.req.param('slug');

  const post = getPostBySlug(slug);
  if (!post) {
    console.warn('MDX not found for slug', slug);
    return c.notFound();
  }

  const Article = post.content;
  const fm = post.frontmatter ?? {};

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
                <span class={tag} key={t}>
                  {t}
                </span>
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
