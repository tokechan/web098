import { createRoute } from 'honox/factory';
import { css, cx } from 'hono/css';
import { FooterBadge } from '../../components/molecules/FooterBadge';
import {
  cardSurface,
  container,
  linkReset,
  metaText,
  mutedCopy,
  sectionStack,
  serifHeading,
  tagPill,
} from '../../styles/tokens';
import { formatDisplayDate, toISODate } from '../../lib/formatters';

const pageStyle = css`
  background: var(--color-bg);
  color: var(--color-text);
`;

const heroSection = css`
  text-align: center;
  padding: clamp(3rem, 12vw, 6rem) 1rem;
  gap: var(--space-5);
`;

const heroLead = css`
  font-size: 1rem;
  letter-spacing: 0.08em;
`;

const heroNav = css`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-4);
`;

const navLink = css`
  font-size: 0.85rem;
  letter-spacing: 0.16em;
`;

const articleGrid = css`
  gap: var(--space-7);
`;

const articleCard = css`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const tagsRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
`;

const footerShell = css`
  border-top: 1px solid var(--color-border);
  padding-block: clamp(2.5rem, 10vw, 4rem);
`;

const footerLinks = css`
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
`;

const heroLinks = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/labs', label: 'Labs' },
  { href: '#', label: 'About' },
];

const featurePosts = [
  {
    title: 'Signalsはレンダーを超える — 新しいリアクティブ思想',
    date: '2025-10-10',
    tags: ['React', 'Signals', 'Architecture'],
    description:
      'Reactの“UI=f(state)”をさらに洗練させる新概念、Signals。再レンダーを手放すための思想でもある。',
    href: '#',
  },
  {
    title: 'Cloudflareで動かす個人開発の未来',
    date: '2025-09-30',
    tags: ['Edge', 'Cloudflare', 'DevOps'],
    description:
      'サーバーを持たず、思想をデプロイする。Edgeで構築する次世代アーキテクチャの可能性を探る。',
    href: '#',
  },
  {
    title: 'Honoxで再構築する思想主導のMPA',
    date: '2025-09-20',
    tags: ['Hono', 'Honox', 'Frontend'],
    description:
      'MPAが再び脚光を浴びる理由。“一貫した思想を持つUI”としてのHonoxの魅力を語る。',
    href: '#',
  },
];

export default createRoute((c) =>
  c.render(
    <div class={pageStyle}>
      <section class={cx(heroSection, sectionStack)}>
        <h1 class={cx(serifHeading, css`font-size: clamp(2.4rem, 6vw, 3rem);`)}>toke travelers</h1>
        <p class={cx(mutedCopy, heroLead)}>思想を実装で確かめる、旅するような技術ブログ。</p>
        <nav class={heroNav}>
          {heroLinks.map((link) => (
            <a key={link.href} href={link.href} class={cx(linkReset, navLink)}>
              {link.label}
            </a>
          ))}
        </nav>
      </section>

      <main class={cx(container, sectionStack, articleGrid)}>
        {featurePosts.map((post) => (
          <article key={post.title} class={cx(cardSurface, articleCard)}>
            <header>
              <h2 class={cx(serifHeading, css`font-size: clamp(1.6rem, 3vw, 2rem);`)}>
                <a href={post.href} class={linkReset}>
                  {post.title}
                </a>
              </h2>
              <div class={cx(metaText, css`display: flex; flex-wrap: wrap; gap: var(--space-2);`)}>
                <time dateTime={toISODate(post.date)}>{formatDisplayDate(post.date)}</time>
              </div>
            </header>
            <p>{post.description}</p>
            <div class={tagsRow}>
              {post.tags.map((tag) => (
                <span key={tag} class={tagPill}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </main>

      <footer class={footerShell}>
        <div class={cx(container, sectionStack)}>
          <FooterBadge />
          <p class={metaText}>© 2025 toke travelers — Built on Honox & Thought.</p>
          <div class={footerLinks}>
            <a href="#" class={linkReset}>
              Buy me a coffee ☕
            </a>
            <span>•</span>
            <a href="#" class={linkReset}>
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
);
