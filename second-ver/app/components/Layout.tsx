import { css, cx } from 'hono/css';
import type { FC } from 'hono/jsx';
import { Header } from './Header';

const containerClass = css`
  max-width: 880px;
  margin: 0 auto;
  padding: 1rem;
`;

export const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <main class={containerClass}>{children}</main>
    </>
  );
};
