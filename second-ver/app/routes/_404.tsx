import type { NotFoundHandler } from 'hono';
import { css } from 'hono/css';
import Document from '../Layout';

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
    <Document title="404 Not Found">
      <section class={wrapper}>
        <h1>Oops! Page not found.</h1>
        <p>お探しのページは存在しません。</p>
        <a href="/">Back to home</a>
      </section>
    </Document>
  );
};

export default handler;
