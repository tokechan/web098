import { createRoute } from 'honox/factory';

type PostMod = {
  frontmatter?: { title?: string; date?: string; tags?: string[] };
  default: (props?: any) => JSX.Element;
};

const modules = import.meta.glob<PostMod>('/content/blog/**/*.mdx', {
  eager: true,
});

const posts = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.replace(/^\/content\/blog\//, '').replace(/\.mdx$/, ''),
    title: mod.frontmatter?.title ?? '(no title)',
    date: mod.frontmatter?.date ?? '',
    description: mod.frontmatter?.description ?? ''
  }))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))


export default createRoute((c) =>
  c.render(
    <main class="mx-auto max-w-2xl p-6">
      <h1 class="text-2xl font-bold mb=4">Blog</h1>
      <ul class="space-y-3">
        {posts.map((p) => (
          <li class="border rounded p-3">
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
