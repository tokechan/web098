import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import type { PostSummary } from '../../lib/posts';
import { PostPreview } from '../molecules/PostPreview';

const section = css`
  display: grid;
  gap: 1.75rem;
`;

const header = css`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const title = css`
  font-size: clamp(1.4rem, 2.8vw, 1.8rem);
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const cta = css`
  font-size: 0.86rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 120ms ease, color 120ms ease;

  &:hover {
    color: var(--color-secondary);
    border-color: currentColor;
  }
`;

const grid = css`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

type LatestPostsProps = {
  posts: PostSummary[];
};

export const LatestPosts: FC<LatestPostsProps> = ({ posts }) => (
  <section class={section} aria-label="Latest blog posts">
    <div class={header}>
      <h2 class={title}>Latest Blogs</h2>
      <a class={cta} href="/blogs">
        View all
      </a>
    </div>
    <div class={grid}>
      {posts.length === 0 ? (
        <p>記事がまだありません。</p>
      ) : (
        posts.map((post) => <PostPreview key={post.slug} post={post} />)
      )}
    </div>
  </section>
);
