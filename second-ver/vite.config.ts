import build from '@hono/vite-build/cloudflare-workers';
import adapter from '@hono/vite-dev-server/cloudflare';
import honox from 'honox/vite';
import { defineConfig } from 'vite';
import ssg from '@hono/vite-ssg';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypePrettyCode from 'rehype-pretty-code';

const entry = './app/server.ts';
const AUDIO_WORKER_PROXY = 'http://127.0.0.1:8788';

export default defineConfig({
  server: {
    proxy: {
      '/api/audio-blog': AUDIO_WORKER_PROXY,
    },
  },
  plugins: [
    honox({
      devServer: { adapter },
      client: { input: [
        '/app/client.ts', 
        '/app/style.css',
        '/app/styles/global.css'
      ] },
    }),
    mdx({
      jsxImportSource: 'hono/jsx',
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: {
              light: 'vitesse-light',
              dark: 'vitesse-dark',
            },
            keepBackground: false,
            defaultLang: 'ts',
          },
        ],
      ],
    }),
    ssg({ entry }),
    build(),
  ],
});
