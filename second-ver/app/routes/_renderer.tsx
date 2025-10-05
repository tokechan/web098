import { jsxRenderer } from 'hono/jsx-renderer';
import { Link, Script } from 'honox/server';
import { Style, css } from 'hono/css';
import { tokens } from '../styles/tokens';
import { Layout } from '../components/Layout';

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <Script src="/app/client.ts" async />
        <Style />
        <style>{`
            :root {  color-scheme: light dark; }
            html { font-size: 18px; font-family: system-ui, sans-serif; }
            body { min-height: 100vh; color:rgba(7, 0, 106, 0.99); background: #f4f4f4; }
            *,*::before,*::after { box-sizing: border-box; margin:0; padding:0; }
            a:focus-visible { outline: 2px solid rgb(1, 6, 106); outline-offset: 2px; }
          `}</style>
      </head>
      <body class={tokens}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
});
