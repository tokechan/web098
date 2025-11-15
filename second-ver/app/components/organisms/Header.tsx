import { css, cx } from 'hono/css';
import type { FC } from 'hono/jsx';
import { useRequestContext } from 'hono/jsx-renderer';
import NavToggle from '../atoms/$NavToggle';
import { container } from '../../styles/tokens';
import { primaryNavLinks, siteBrand, type NavLink } from '../../lib/navigation';

const headerClass = css`
  border-bottom: 3px solid var(--color-accent);
  background: var(--color-bg);
  color: var(--color-text);

  /* 横幅はcontainerで制御するのでここは余白のみ */
  padding: clamp(0.75rem, 2.5vw, 1.41rem) 0;

  /* reduce motion 対応 */
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

const innerClass = css`
  /* container を中で並べるflexラッパー */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(0.75rem, 2vw, 1.5rem);
`;

/* ブランド（サイト名） */
const titleClass = css`
  font-family: var(--font-serif);
  font-size: 1.6rem;
  margin: 0;
  letter-spacing: var(--letter-spacing-wide);
`;

/* ブランド用リンク（Hoverで銅色だけに反応、背景はつけない） */
const brandLink = css`
  color: var(--color-text);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color 0.3s ease, border-color 0.3s ease;

  &:hover {
    color: var(--color-secondary);
    border-color: var(--color-secondary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
    border-color: transparent;
  }
`;

/* ナビ本体（モバイルドロワー + PC常時表示） */
const navClass = css`
  /* 初期は非表示（モバイル） */
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;

  /* 🟢 モバイル幅（<=767px）：右からスライドイン */
  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(80vw, 320px);
    background: var(--color-bg);
    box-shadow: -12px 0 24px rgba(0, 0, 0, 0.15);
    z-index: 40;
    transform: translateX(100%);
    transition: transform 160ms ease;
  }

  /* 🖥 PC（>=768px）：横並びで常時表示 */
  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
    padding: 0;
    align-items: center;
    gap: 0.5rem;
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

/* 背景の半透明幕（モバイル時） */
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

/* 共通リンクスタイル（ナビ用） */
const linkBase = css`
  display: inline-block;
  text-decoration: none;
  padding: 0.6rem 0.9rem;
  color: var(--color-accent);
  border-radius: 6px;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;

  &:hover {
    color: var(--color-secondary);
    background-color: rgba(182, 122, 79, 0.08); /* Proof Copperの淡トーン */
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`;

/* Activeリンク（現在地） */
const activeLinkClass = css`
  background-color: rgba(63, 112, 77, 0.10); /* Traveler Greenの薄トーン */
  color: var(--color-accent);
  font-weight: 600;
`;

export const Header: FC<{ links?: readonly NavLink[] }> = ({
  links: navLinks = primaryNavLinks,
}) => {
  const c = useRequestContext();
  const current = c.req.path;

  return (
    <header class={headerClass}>
      <div class={cx(container, innerClass)}>
        <h1 class={titleClass}>
          <a href={siteBrand.homeHref} class={brandLink}>
            {siteBrand.name}
          </a>
        </h1>

        {/* ★ モバイル用トグル（Island） */}
        <NavToggle target="primary-nav" backdropId="nav-backdrop" />

        {/* 背景幕 */}
        <div id="nav-backdrop" class={backdropClass} data-open="false" />

        {/* メニュー本体（SSR）初期は data-open='false' */}
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
      </div>
    </header>
  );
};
