import {createRoute } from 'honox/factory'

export default createRoute(async (c) => {
  const  { slug } = c.req.param()
  const post = await getPost(slug)
  if (!post) return c.render(<h1>Not Found</h1>)
  return c.render(
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
})

async function getPost(slug: string) {
  const map: Record<string, { title: string; html: string }> = {
    'hello-honox': {title: 'Good evning honox', html: '<p>Wellcome!!<p>'},
    'routing-notes': {title: 'Routing memo', html: '<p>file base routing is cool!!</p>'},
  }
  return map[slug]
}