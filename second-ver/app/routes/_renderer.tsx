import { jsxRenderer } from 'hono/jsx-renderer';
import { Link, Script } from 'honox/server';
import { Style } from 'hono/css';
import { Layout } from '../components/templates/Layout';



export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        {/* CSS をheadにリンクで載せる */}
        <link rel="stylesheet" href="/app/style.css" />
        <link rel="stylesheet" href="/app/styles/global.css" />



        <Script src="/app/client.ts" async />
        <Style />{/* hono/cssの出力　*/}
      
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
});
