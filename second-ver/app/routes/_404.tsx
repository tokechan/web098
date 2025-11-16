import type { NotFoundHandler } from 'hono';
import { css } from 'hono/css';
import { paths } from '../lib/paths';

const wrapper = css`
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const handler: NotFoundHandler = (c) => {
  c.status(404);
  return c.render(
    <section class={wrapper}>
      <h1>Oops! Page not found.</h1>
      <p>お探しのページは存在しません。</p>
      <a href={paths.home}>Back to home</a>
    </section>
  );
};

export default handler;
