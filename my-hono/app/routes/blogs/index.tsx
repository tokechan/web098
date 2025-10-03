import { createRoute } from 'honox/factory';

type Post = { slug: string; title: string; excerpt?: string }

export default createRoute(async (c) => {
  const posts: Post[] = await getPosts()
  return c.render(
    <main>
      <h1>Blogs</h1>
      <ul>
        {posts.map(p => (
          <li key={p.slug}>
            <a href={`/blogs/${p.slug}`}>{p.title}</a>
            {p.excerpt && <p>{p.excerpt}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
})

async function getPosts(): Promise<Post[]> {
  return [
    { slug: 'hello-honox', title: 'good evning honox', excerpt: 'First honox blog post'},
    { slug: 'routing-notes', title: 'Routing memo'},
  ]
}