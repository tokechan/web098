import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import { FooterBadge } from './FooterBadge';

const footerWrapperStyle = css`
  padding: 4rem 1rem;
  background: transparent;
  display: flex;
  justify-content: center;
  width: 100%;
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
                <a class="badge__link" href="https://github.com/" target="_blank" rel="noreferrer noopener">
                  GitHub
                </a>
                <a class="badge__link" href="https://x.com/" target="_blank" rel="noreferrer noopener">
                  X
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
