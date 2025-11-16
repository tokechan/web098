import type { ErrorHandler } from 'hono';
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

const handler: ErrorHandler = (e, c) => {
  if ('getResponse' in e) {
    return e.getResponse();
  }
  console.error(e.message);
  c.status(500);
  return c.render(
    <section class={wrapper}>
      <h1>Internal Server Error</h1>
      <p>申し訳ありませんが、エラーが発生しました。</p>
      <a href={paths.home}>Back to home</a>
    </section>
  );
};

export default handler;
