import { createRoute } from 'honox/factory';
import { css } from 'hono/css';
import type { FC } from 'hono/jsx';

type PostMod = {
  frontmatter?: { 
    title?: string; 
    date?: string; 
    tags?: string[];
    description?: string;
  };
  default: (props?: any) => FC;
};

const titleClass = css`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const cards = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const card = css`
  border: 3px solid rgba(1, 80, 149, 0.5);
  border-radius: 3px;
  padding: 1rem;
  width: 100%;
  list-style: none;
`;

const modules = import.meta.glob<PostMod>('../../content/blog/**/*.mdx', {
  eager: true,
});

const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const after = path.split('/content/blog/')[1] ?? path;
    const slug = after.replace(/\.mdx$/, '');
    return {
      slug,
      title: mod.frontmatter?.title ?? '(no title)',
      date: mod.frontmatter?.date ?? '',
      description: mod.frontmatter?.description ?? '',
    };
  })
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export default createRoute((c) =>
  c.render(
    <main class="mx-auto max-w-2xl p-6">
      <h1 class="text-2xl font-bold mb-4">Blog</h1>
      <ul class={cards}>
        {posts.map((p) => (
          <li class={card}>
            <a href={`/blog/${p.slug}`} class="underline">
              {p.title}
            </a>
            <div class="text-sm opacity-70">{p.date}</div>
          </li>
        ))}
      </ul>
    </main>
  )
);
