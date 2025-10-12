import { css } from "hono/css";

export const Header = () => {
  const header = css`
    background: var(--color-bg);
    color: var(--color-text);
    padding: 4rem 1rem 2rem;
    text-align: center;
    border-bottom: 1px solid var(--color-border);
  `;

  const brand = css`
    font-family: var(--font-serif);
    font-size: 2.4rem;
    letter-spacing: var(--letter-spacing-wide);
    a {
      color: var(--color-text);
      text-decoration: none;
      transition: color 0.3s ease;
      &:hover {
        color: var(--color-secondary);
      }
    }
  `;

  const tagline = css`
    color: var(--color-muted);
    margin-top: 0.5rem;
    font-size: 1rem;
    letter-spacing: 0.05em;
  `;

  const nav = css`
    margin-top: 2.5rem;
    display: flex;
    justify-content: center;
    gap: 1.6rem;
    flex-wrap: wrap;
    a {
      font-family: var(--font-sans);
      font-weight: 500;
      font-size: 0.95rem;
      color: var(--color-accent);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: color 0.2s ease, border-color 0.2s ease;
      &:hover {
        color: var(--color-secondary);
        border-color: var(--color-secondary);
      }
    }
  `;

  return (
    <header class={header}>
      <h1 class={brand}>
        <a href="/">toke travelers</a>
      </h1>
      <p class={tagline}>思想を実装で確かめる。</p>
      <nav class={nav}>
        <a href="/">Home</a>
        <a href="/blogs">Blogs</a>
        <a href="/labs">Labs</a>
        <a href="/about">About</a>
      </nav>
    </header>
  );
};
