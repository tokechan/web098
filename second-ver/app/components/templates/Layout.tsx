import { css, cx } from 'hono/css';
import type { FC } from 'hono/jsx';
import { Header } from '../organisms/Header';
import { Footer } from '../organisms/Footer';
import { container } from '../../styles/tokens';

const pageClass = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const mainClass = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(3rem, 6vw, 5rem);
  padding-block: clamp(4rem, 12vw, 8rem) clamp(6rem, 14vw, 10rem);
`;

export const Layout: FC = ({ children }) => {
  return (
    <div class={pageClass}>
      <Header />
      <main class={cx(container, mainClass)}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
