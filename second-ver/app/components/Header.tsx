import { css, cx } from 'hono/css';
import type { FC } from 'hono/jsx';
import { useRequestContext } from 'hono/jsx-renderer';

const headerClass = css`
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 1rem;
  justify-content: space-between;
  background: #fff;
`;

const titleClass = css`
  font-size: 1.5rem;
  margin: 0;
`;

const navClass = css`
  display: flex;
  gap: 0.25rem;
`;

const linkBase = css`
  display: inline-block; /* padding有効化 */
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  color: #262626;
  border-radius: 6px;
  transition: background-color 120ms ease;
  &:hover {
    background-color: #efefef;
  }
  &:focus-visible {
    outline: 2px solid #646cff;
    outline-offset: 2px;
  }
`;

const activeLinkClass = css`
  background-color: #e9e9e9;
`;

export type NavLink = { href: string; text: string };

const defaultLinks: readonly NavLink[] = [
  { href: '/', text: 'Home' },
  { href: '/blogs', text: 'Blogs' },
  { href: '/labs', text: 'Labs' },
] as const;

export const Header: FC<{ links?: readonly NavLink[] }> = ({
  links: navLinks = defaultLinks,
}) => {
  const c = useRequestContext();
  const current = c.req.path;

  return (
    <header class={headerClass}>
      <h1 class={titleClass}>
        <a href="/" class={linkBase}>
          tokec&apos;s web site
        </a>
      </h1>
      <nav class={navClass} aria-label="Primary">
        {navLinks.map((link) => {
          const isActive =
            current === link.href || current.startsWith(link.href + '/');
          return (
            <a
              key={link.href}
              href={link.href}
              class={cx(linkBase, isActive && activeLinkClass)}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.text}
            </a>
          );
        })}
      </nav>
    </header>
  );
};
