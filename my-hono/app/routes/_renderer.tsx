import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
import { Style, css } from 'hono/css'
import { Layout } from '../components/layout'

export default jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        <Style>
        {css`
            html {
              font-size: 16px;
              font-family: system-ui, sans-serif;
            }
            body {
              min-height: 100vh;
              color: #262626;
              background-color:rgb(226, 224, 224);
            }
            *,
            *::before,
            *::after {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
          }`}

        </Style>
      </head>
      <body>
        <Layout>
        {children}
        </Layout>  
      </body>
    </html>
  )
})
