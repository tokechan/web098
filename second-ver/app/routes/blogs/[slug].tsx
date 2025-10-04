import { createRoute } from 'honox/factory';

const modules = import.meta.glob('/content/blog/**/*.mdx');

export default createRoute(async (c) => {
  const slug = c.req.param('slug');
  const mdxPath = Object.keys(modules).find((p) => p.endsWith('/${slug}.mdx'));
  if (!mdxPath) return c.notFound();

  const mod: any = await modules[mdxPath]!();
  const { default: MDX, frontmatter } = mod;

  return c.render(
    <article class="prose mx-auto p-6">
      <title>{frontmatter?.title ?? ''}</title>
      <h1>{frontmatter?.title ?? ''}</h1>
      <MDX />
    </article>
  );
});
