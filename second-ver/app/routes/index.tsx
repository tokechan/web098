import { createRoute } from 'honox/factory';
import { css } from 'hono/css';
import Time from '../islands/time';

const className = css`
  font-family: sans-serif;
`;

export default createRoute(
  (
    c // const name = c.req.query('name') ?? 'tokec'
  ) =>
    c.render(
      <div class="py-8 text-center">
        <h1 class="text-3xl font-bold">Hello! honox</h1>
        <p>✏️blog+小さなWebサービスの実験場🧪</p>
        <Time />
      </div>
    )
);
