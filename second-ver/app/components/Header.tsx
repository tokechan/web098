import { css, cx } from 'hono/css';
import type { FC } from 'hono/jsx';
import { useRequestContext } from 'hono/jsx-renderer';
import NavToggle from '../islands/NavToggle';

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
  /* mobile close */
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0;

  /*PC allways aling */
  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    padding: 0;
    align-items: center;
    gap: 0.25rem;
  }

  /* Islandが data-open="true" を付けたら、モバイルでも表示 */
  &[data-open='true'] {
    display: flex;
  }
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
      {/* ★ モバイル用トグル（Island） */}
      <NavToggle target="primary-nav" />
      {/* メニュー本体（SSR)初期はdata-open='fales' */}
      <nav
        id="primary-nav"
        class={navClass}
        data-open="false"
        aria-label="Primary"
      >
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
