import { css } from 'hono/css';
import { createRoute } from 'honox/factory';
import { toSummary } from '../../lib/mappers';
import type { PostRow } from '../../lib/types';
import { getPostRows } from '../../lib/repo';
import { FC } from 'hono/jsx';

type Props = {
  posts: import('../../lib/types').PostSummary[];
};

const titleClass = css`
  font-size: 1.7rem;
  margin-bottom: 1rem;
`;

const cards = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const card = css`
  border: 1.5px solid rgb(139, 250, 35);
  border-radius: 3px;
  padding: 1rem;
  width: 100%;
  list-style: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: rgba(250, 150, 10, 0.75);
    border-color:rgb(139, 250, 35);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(11, 202, 119, 0.2);
  }
`;

const Page: FC<Props> = ({ posts }) => {
  return (
    <main>
      <h1 class={titleClass}>Blogs</h1>
      <ul class={cards}>
        {posts.map((p) => (
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
  const rows = await getPostRows();
  const posts = rows.map(toSummary);
  return c.render(<Page posts={posts} />);
});

// async function getPosts(): Promise<Post[]> {
//   return [
//     { slug: 'hello-honox', title: 'good evning honox', excerpt: 'First honox blog post'},
//     { slug: 'routing-notes', title: 'Routing memo'},
//   ]
// }
