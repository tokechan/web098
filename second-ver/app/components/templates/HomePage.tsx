import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import { FooterBadge } from '../molecules/FooterBadge';
import Time from '../atoms/$Time';

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

const timeStyle = css`
  font-size: 0.85rem;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-align: center;
`;

type HomePageProps = {
  /**
   * Toggle the real-time clock display above the hero badge.
   */
  showClock?: boolean;
};

export const HomePage: FC<HomePageProps> = ({ showClock = false }) => (
  <div class={wrapperStyle}>
    {showClock && (
      <div class={timeStyle}>
        <Time />
      </div>
    )}
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
);
