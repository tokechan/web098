import { css } from 'hono/css';

export const prose = css`
  line-height: 1.6;
  color: var(--color-text);

  h1, h2, h3, h4, h5 {
    font-weight: 700;
    line-height: 1.2;
    margin-top: var(--space-6);
    margin-bottom: var(--space-3);
  }
  /* heading */
  h1 {
    font-size: 1.8rem;
  }
  h2 {
    font-size: 1.6rem;
  }
  h3 {
    font-size: 1.4rem;
  }
  h4 {
    font-size: 1.2rem;
  }
  h5 {
    font-size: 1rem;
  }

  /* paragraph - list */
  p {
    margin: var(--space-4) 0;
  }
  ul , ol {
    padding-left: 1.25rem; margin: var(--space-4) 0;
  }
 li {
    margin: 0.25rem 0;
  }
  
  /* blockquote */
  blockquote {
    border-left: 4px solid var(--color-border);
    padding-left: var(--space-4);
    color: var(--color-muted);
    margin: var(--space-5) 0;
  }
  
  /* code (inline) */
  :not(pre) > code {
    background: rgba(0,0,0,0.04);
    padding: 0.15rem 0.30rem;
    border-radius: 0.25rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.875rem;
  }

  /* code (block) */
  pre {
    overflow-x: auto;
    padding: var(--space-4);
    border-radius: 0.5rem;
    margin: var(--space-5) 0;
  }
`;