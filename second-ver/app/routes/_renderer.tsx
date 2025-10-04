import { jsxRenderer } from 'hono/jsx-renderer';
import { Link, Script } from 'honox/server';
import { Style, css } from 'hono/css';
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
        <Style>
          {css`
            :root {
              color-scheme: light dark;
            }
            html {
              font-size: 16px;
              font-family: system-ui, sans-serif;
            }
            body {
              min-height: 100vh;
              color: #262626;
              background-color: #f4f4f4;
            }
            *,
            *::before,
            *::after {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            a:focus-visible {
              outline: 2px solid #646cff;
              outline-offset: 2px;
            }
          `}
        </Style>
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
});
