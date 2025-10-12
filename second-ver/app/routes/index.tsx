import { createRoute } from 'honox/factory';
import { css } from 'hono/css';
import { FooterBadge } from '../components/FooterBadge';
import Time from '../islands/time';

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(3rem, 6vw, 5rem);
  padding: clamp(4rem, 12vw, 8rem) 0 clamp(6rem, 14vw, 10rem);
  width: min(100%, 1280px);
  margin: 0 auto;
  padding-left: clamp(1.5rem, 4vw, 3rem);
  padding-right: clamp(1.5rem, 4vw, 3rem);
`;

const taglineStyle = css`
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.75rem;
  color: var(--color-muted);
`;

const timeStyle = css`
  font-size: 0.85rem;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-align: center;
`;

export default createRoute((c) =>
  c.render(
    <div class={wrapperStyle}>
      {/* <div class={timeStyle}>
        <Time />
      </div> */}
      <FooterBadge
        headingPrimary="Trying Anyway"
        headingSecondary="Tiny Experiments"
        headingAccent="Messy but Curious"
        editionLabel="Develop Edition"
        footerText="Crafted For Curious Minds"
        metaSections={[
          { label: 'Powered By', value: 'Cloudflare', variant: 'script' },
          { label: 'Maker', value: 'tokec', variant: 'signature' },
          { label: 'Vol', value: '53.5% Ideas', variant: 'script' },
        ]}
        ariaLabel="Trying Anyway — Tiny Experiments — Messy but Curious"
        scale="hero"
      />

    </div>
  )
);
