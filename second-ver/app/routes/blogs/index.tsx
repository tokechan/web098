import { createRoute } from 'honox/factory';
import { css, cx } from 'hono/css';
import { getAllPosts } from '../../lib/posts';
import { PostPreview } from '../../components/molecules/PostPreview';
import {
  container,
  gridAutoCards,
  listReset,
  sectionStack,
  serifHeading,
} from '../../styles/tokens';

const wrapper = css`
  padding-block: var(--page-padding-top) var(--page-padding-bottom);
`;

const heading = css`
  font-size: clamp(2rem, 4vw, 2.8rem);
`;

const list = css`
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export default createRoute((c) =>
  c.render(
    <section class={cx(container, sectionStack, wrapper)}>
      <h1 class={cx(serifHeading, heading)}>Blogs</h1>
      <ul role="list" class={cx(listReset, gridAutoCards, list)}>
        {getAllPosts().map((post) => (
          <li key={post.slug}>
            <PostPreview post={post} />
          </li>
        ))}
      </ul>
    </section>
  )
);
