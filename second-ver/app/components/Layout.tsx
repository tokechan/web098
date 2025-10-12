import { css, cx } from 'hono/css';
import type { FC } from 'hono/jsx';
import { Header } from './Header';
import { Footer } from './Footer';

const pageClass = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const mainClass = css`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const containerClass = css`
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 1rem;
`;

export const Layout: FC = ({ children }) => {
  return (
    <div class={pageClass}>
      <Header />
      <main class={mainClass}>
        <div class={containerClass}>{children}</div>
      </main>
      <Footer />
    </div>
  );
};
