import { css } from 'hono/css';
import { createRoute } from 'honox/factory';
import { Post, getPosts } from '../../lib/db';
import { FC } from 'hono/jsx';

type Post = { slug: string; title: string; excerpt?: string }

type Props = {
  posts: Post[];
};


const titleClass = css`
  font-size: 1.7rem;
  margin-bottom: 1rem;
`;

const cards = css`
  display: grid;
  grid-template-columes: repate(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const card = css`
  border: 1.5px solid rgb(62, 11, 202);
  border-radius: 3px;
  padding: 1rem;
  width: 100%;
  list-style: none;
`;



    
    
    
const Page: FC<Props> = ({ posts }) => {
  return (    
    <main>
      <h1 class={titleClass}>Blogs</h1>
      <ul class={cards}>
        {posts.map(p => (
          <li class={card} key={p.slug}>
            <a href={`/blogs/${p.slug}`}>{p.title}</a>
            {p.excerpt && <p>{p.excerpt}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
};



export default createRoute(async (c) => {
  const posts: Post[] = await getPosts()
  return c.render(<Page posts={posts} />, { title: "Posts" });
});



// async function getPosts(): Promise<Post[]> {
//   return [
//     { slug: 'hello-honox', title: 'good evning honox', excerpt: 'First honox blog post'},
//     { slug: 'routing-notes', title: 'Routing memo'},
//   ]
// }