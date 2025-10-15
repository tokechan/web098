import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import { FooterBadge } from '../molecules/FooterBadge';

const GitHubIcon = () => (
  <svg class="badge__linkIcon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 .3a11.7 11.7 0 0 0-3.7 22.8c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.7 1.1.1-.9.5-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.5 1.3-3.3-.1-.3-.6-1.6.1-3.4 0 0 1-.3 3.4 1.3a11.7 11.7 0 0 1 6.2 0c2.3-1.6 3.4-1.3 3.4-1.3.7 1.8.2 3.1.1 3.4.8.8 1.3 2 1.3 3.3 0 4.8-2.8 5.8-5.5 6 .4.3.8 1 .8 2.1v3c0 .3.2.7.8.6A11.7 11.7 0 0 0 12 .3z" />
  </svg>
);

const XIcon = () => (
  <svg class="badge__linkIcon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 2.5h4.1L12 10l4.8-7.5H21l-7.5 10.5L21 21.5h-4.1L12 14.5l-4.8 7H3l7.5-10.5L3 2.5z" />
  </svg>
);

const footerWrapperStyle = css`
  padding: clamp(4rem, 8vw, 6rem) 0 clamp(3rem, 6vw, 5rem);
  background: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: 3px solid var(--color-accent);
`;

const siteName = 'toke travelers';

export const Footer: FC = () => {
  return (
    <footer class={footerWrapperStyle}>
      <FooterBadge
        showHeading={false}
        variant="strip"
        ariaLabel="Site footer"
        metaSections={[
          { label: 'Powered By', value: 'Cloudflare', variant: 'script' },
          { label: 'Copyright', value: `© ${new Date().getFullYear()} ${siteName}`, variant: 'signature' },
          {
            label: 'Social',
            value: (
              <>
                <a
                  class="badge__link"
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                  <span class="badge__linkText">GitHub</span>
                </a>
                <a
                  class="badge__link"
                  href="https://x.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="X"
                >
                  <XIcon />
                  <span class="badge__linkText">X</span>
                </a>
              </>
            ),
            variant: 'links',
          },
        ]}
        footerText={siteName.toUpperCase()}
      />
    </footer>
  );
};
