import { PropsWithChildren } from 'hono/jsx';
import { Script } from 'honox/server';
import { Style } from 'hono/css';
import { Layout as SiteLayout } from './components/templates/Layout';

type DocumentProps = PropsWithChildren<{
  title?: string;
}>;

// HTML ドキュメント全体をここで集約し、_renderer と重複しないようにする
export default function Document({ children, title }: DocumentProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {title && <title>{title}</title>}
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/app/style.css" />
        <link rel="stylesheet" href="/app/styles/global.css" />
        <Script src="/app/client.ts" async />
        <Style />
      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
