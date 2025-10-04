import build from '@hono/vite-build/cloudflare-workers';
import adapter from '@hono/vite-dev-server/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import honox from 'honox/vite';
import { defineConfig } from 'vite';
import ssg from '@hono/vite-ssg';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const entry = './app/server.ts';

export default defineConfig({
  plugins: [
    honox({
      devServer: { adapter },
      client: { input: ['/app/client.ts', '/app/style.css'] },
    }),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    ssg({ entry }),
    tailwindcss(),
    build(),
  ],
});
