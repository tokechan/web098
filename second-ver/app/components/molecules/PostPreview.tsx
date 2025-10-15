import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import type { PostSummary } from '../../lib/posts';

const card = css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.92);
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-accent);
    box-shadow: 0 14px 34px rgba(28, 50, 40, 0.15);
  }

  &:focus-within {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }
`;

const title = css`
  font-size: 1.05rem;
  font-weight: 640;
  letter-spacing: 0.03em;
  margin: 0;

  & a {
    color: var(--color-text);
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: color 160ms ease, border-color 160ms ease;
  }

  & a:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
`;

const meta = css`
  font-size: 0.82rem;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const description = css`
  font-size: 0.9rem;
  color: var(--color-muted);
  line-height: 1.5;
`;

type PostPreviewProps = {
  post: PostSummary;
};

export const PostPreview: FC<PostPreviewProps> = ({ post }) => (
  <article class={card}>
    <h3 class={title}>
      <a href={post.url}>{post.title}</a>
    </h3>
    {post.date && (
      <time datetime={post.date} class={meta}>
        {post.date}
      </time>
    )}
    {post.description && <p class={description}>{post.description}</p>}
  </article>
);
