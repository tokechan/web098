import { cx } from 'hono/css';
import type { FC } from 'hono/jsx';
import { Header } from '../organisms/Header';
import { Footer } from '../organisms/Footer';
import { container, pageShell, pageMain } from '../../styles/tokens';

export const Layout: FC = ({ children }) => {
  return (
    <div class={pageShell}>
      <Header />
      <main class={cx(container, pageMain)}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
