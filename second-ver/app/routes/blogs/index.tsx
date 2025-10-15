import { createRoute } from 'honox/factory';
import { css, keyframes } from 'hono/css';
import { getAllPosts } from '../../lib/posts';

//Design tokens ====
const vars = css`
  --container-max: 48rem;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 2.5rem;
  --space-8: 3rem;
  --space-9: 3.5rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --border-strong: 3px;
  --color-border: rgba(0, 0, 71, 0.83);
  --color-link: rgba(30, 30, 203, 0.83);
  --color-text: rgba(28, 28, 151, 0.83);
  --color-muted: rgba(43, 48, 73, 0.66);
`;


//==== Layout ====
const mainClass = css`  
  margin-left: auto;
  margin-right: auto;
  max-width: var(--container-max);
  padding: var(--space-5);
`;

const pageTitle = css`
  font-size: 1.5rem;
  font-weight: 650;
  margin-bottom: var(--space-4);
  line-height: 1.2;
`;

const grid = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);

  @media (width <= 420px) {
    grid-template-columns: 1fr;
  }
`;

const appear = keyframes`
  from  { opacity: 0; transform: translateY(2px) }
  to    { opacity: 1; transform: translateY(0) }
`;

const card = css`
  list-style: none;
  border: 3px solid var(--color-accent);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  animation: ${appear} 160ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  &:focus-within {
    outline: 2px solid var(--color-link);
    outline-offset: 2px;
  }

  &:hover {
    border-color: var(--color-accent-hover);
  }

`;

const articleTitle = css`
  font-size: 1.125rem;
  font-weight: 650;
  margin-bottom: var(--space-2);

  & a {
    color: var(--color-text);
    text-decoration: underline;
  }

  & a:hover {
  text-decoration-thickness: 2px;
  }

  & a:focus-visible {
    outline: 2px solid var(--color-link);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;


const metaTime = css`
  font-size: 0.875rem;
  color: var(--color-muted);
  margin-bottom: var(--space-2);
`;

const desc = css`
  font-size: 0.875rem;
  color: var(--color-muted);
`;





export default createRoute((c) =>
  c.render(
    <main class={mainClass}>
      <h1 class={pageTitle}>Blog</h1>
      <ul role="list" class={grid}>
        {getAllPosts().map((post) => (
          <li class={card} key={post.slug}>
            <article>
              <h2 class={articleTitle}>
                <a href={post.url}>
                  {post.title}
                </a>
              </h2>
              <time datetime={post.date} class={metaTime}>
                {post.date}
              </time>
              {post.description && <p class={desc}>{post.description}</p>}
            </article>
          </li>
        ))}
      </ul>
    </main>
  )
);
