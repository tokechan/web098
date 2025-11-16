import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import type { PostSummary } from '../../lib/posts';
import { PostPreview } from '../molecules/PostPreview';
import { SectionHeader } from '../molecules/SectionHeader';

const section = css`
  display: grid;
  gap: 1.75rem;
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
    <SectionHeader title="Latest Blogs" cta={{ href: '/blogs', label: 'View all' }} />
    <div class={grid}>
      {posts.length === 0 ? (
        <p>記事がまだありません。</p>
      ) : (
        posts.map((post) => <PostPreview key={post.slug} post={post} />)
      )}
    </div>
  </section>
);
