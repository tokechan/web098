import { createRoute } from 'honox/factory';
import { css } from 'hono/css';
import { getLabBySlug } from '../../lib/labs';
import { prose } from '../../styles/prose';

const wrapper = css`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-5);
`;

const meta = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  color: var(--color-muted);
  letter-spacing: 0.08em;
  font-size: 0.85rem;
  margin-bottom: var(--space-4);
`;

const tagList = css`
  display: inline-flex;
  gap: var(--space-2);
`;

const tag = css`
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
`;

export default createRoute((c) => {
  const slug = c.req.param('slug');
  const lab = getLabBySlug(slug);
  if (!lab) {
    return c.notFound();
  }

  const Article = lab.component;

  return c.render(
    <main class={wrapper}>
      <header>
        <h1>{lab.frontmatter.title ?? '(no title)'}</h1>
        <div class={meta}>
          {lab.frontmatter.date && (
            <time dateTime={lab.frontmatter.date}>{lab.frontmatter.date}</time>
          )}
          {lab.frontmatter.tags && lab.frontmatter.tags.length > 0 && (
            <div class={tagList}>
              {lab.frontmatter.tags.map((t) => (
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
