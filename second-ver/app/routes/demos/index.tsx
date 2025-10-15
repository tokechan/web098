import { createRoute } from 'honox/factory';
import { css } from 'hono/css';
import { FooterBadge } from '../../components/molecules/FooterBadge';

const pageStyle = css`
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: var(--line-height-base);
`;

const headerStyle = css`
  text-align: center;
  padding: 5rem 1rem 3rem;

  & h1 {
    font-family: var(--font-serif);
    font-size: 2.6rem;
    letter-spacing: var(--letter-spacing-wide);
    margin-bottom: 0.5rem;
  }

  & p {
    color: var(--color-muted);
    font-size: 1rem;
    letter-spacing: 0.05em;
  }
`;

const navStyle = css`
  margin-top: 2rem;

  & a {
    color: var(--color-accent);
    margin: 0 0.8rem;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease, color 0.2s ease;
  }

  & a:hover {
    border-color: var(--color-secondary);
    color: var(--color-secondary);
  }
`;

const mainStyle = css`
  max-width: 880px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
`;

const postStyle = css`
  border-top: 1px solid var(--color-accent);
  margin-top: 2.5rem;
  padding-top: 2.5rem;

  & h2 {
    font-family: var(--font-serif);
    font-size: 1.6rem;
    margin-bottom: 0.4rem;
    color: var(--color-accent);
  }

  & a {
    color: var(--color-accent);
    text-decoration: none;
  }

  & a:hover {
    color: var(--color-secondary);
  }

  & p.meta {
    color: var(--color-muted);
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  & p.desc {
    font-size: 1rem;
    color: var(--color-text);
  }
`;

const footerStyle = css`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-muted);
  font-size: 0.9rem;
  border-top: 1px solid var(--color-accent);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.8rem;

  & a {
    color: var(--color-accent);
    text-decoration: none;
  }

  & a:hover {
    color: var(--color-secondary);
  }

  & .footer__meta {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.18em;
  }

  & .footer__links {
    margin: 0;
    letter-spacing: 0.06em;
  }
`;

export default createRoute((c) =>
  c.render(
    <div class={pageStyle}>
      <header class={headerStyle}>
        <h1>toke travelers</h1>
        <p>思想を実装で確かめる、旅するような技術ブログ。</p>
        <nav class={navStyle}>
          <a href="/">Home</a>
          <a href="/blogs">Blogs</a>
          <a href="/labs">Labs</a>
          <a href="#">About</a>
        </nav>
      </header>

      <main class={mainStyle}>
        <article class={postStyle}>
          <h2><a href="#">Signalsはレンダーを超える — 新しいリアクティブ思想</a></h2>
          <p class="meta">2025-10-10 / Tags: React, Signals, Architecture</p>
          <p class="desc">
            Reactの“UI=f(state)”をさらに洗練させる新概念、Signals。  
            それは再レンダーを手放すための思想でもある。
          </p>
        </article>

        <article class={postStyle}>
          <h2><a href="#">Cloudflareで動かす個人開発の未来</a></h2>
          <p class="meta">2025-09-30 / Tags: Edge, Cloudflare, DevOps</p>
          <p class="desc">
            サーバーを持たず、思想をデプロイする。  
            Edgeで構築する次世代アーキテクチャの可能性を探る。
          </p>
        </article>

        <article class={postStyle}>
          <h2><a href="#">Honoxで再構築する思想主導のMPA</a></h2>
          <p class="meta">2025-09-20 / Tags: Hono, Honox, Frontend</p>
          <p class="desc">
            MPAが再び脚光を浴びる理由。  
            “一貫した思想を持つUI”としてのHonoxの魅力を語る。
          </p>
        </article>
      </main>

      <footer class={footerStyle}>
        <FooterBadge />
        <p class="footer__meta">© 2025 toke travelers — Built on Honox & Thought.</p>
        <p class="footer__links">
          <a href="#">Buy me a coffee</a> ☕ | <a href="#">Contact</a>
        </p>
      </footer>
    </div>
  )
);
