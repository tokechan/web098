import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import { Header } from '../organisms/Header';
import { Footer } from '../organisms/Footer';

const pageClass = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const mainClass = css`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Layout: FC = ({ children }) => {
  return (
    <div class={pageClass}>
      <Header />
      <main class={mainClass}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
