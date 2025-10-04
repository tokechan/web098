import { createRoute } from 'honox/factory';
import { Post, getPostBySlug } from '../../lib/db';
import { css } from 'hono/css';
import create from './create';
import { FC } from 'hono/jsx';
import { parseMarkdown } from '../../lib/markdown';

const cardClass = css`
  border: 3px solid rgba(248, 11, 173, 0.43);
  border-radius: 3px;
  padding: 1px;
  widht: 100%;
`;

const titleClass = css`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const contentClass = css`
  margin-top: 1.5rem;

  p + p {
    margin-top: 1rem;
  }

  ul {
    margin-top: 1rem;
  }

  ul li {
    list-style: disc;
    margin-left: 1rem;
    margin-bottom: 0.5rem;
  }
`;

type Props = {
  post: Post;
  content: string;
};

const Page: FC<Props> = ({ post, content }) => {
  return (
    <article class={cardClass}>
      <header>
        <h1 class={titleClass}>{post.title}</h1>
      </header>
      <div
        class={contentClass}
        id="contents"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
};

export default createRoute(async (c) => {
  const { slug } = c.req.param();
  const post = await getPostBySlug(slug);
  if (!post) {
    return c.notFound();
  }

  const content = parseMarkdown(post.content);

  return c.render(<Page post={post} content={content} />);
});
