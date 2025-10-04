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
  /* モバイルは右から出る引き出し（初期は非表示） */
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;

  /* 🟢 モバイル幅で右からスライドイン（<=767px） */
  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(80vw, 320px);
    background: #fff;
    box-shadow: -12px 0 24px rgba(0, 0, 0, 0.15);
    z-index: 40;
    transform: translateX(100%);
    transition: transform 160ms ease;
  }

  /* 🖥 PCは従来どおり横並び常時表示（>=768px） */
  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    padding: 0;
    align-items: center;
    gap: 0.25rem;
    position: static;
    transform: none;
    box-shadow: none;
    width: auto;
  }

  /* Island が data-open="true" を付けたらモバイルでも開く */
  &[data-open='true'] {
    display: flex;
    @media (max-width: 767px) {
      transform: translateX(0);
    }
  }
`;

const backdropClass = css`
  display: none;

  @media (max-width: 767px) {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 30;
  }

  &[data-open='true'] {
    display: block;
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
      <NavToggle target="primary-nav" backdropId="nav-backdrop" />
      <div id="nav-backdrop" class={backdropClass} data-open="false" />
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
