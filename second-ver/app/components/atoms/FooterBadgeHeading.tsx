import { css, cx } from 'hono/css';

const headingStyle = css`
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding-bottom: 1.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;

  & .heading__primary {
    font-family: var(--font-serif);
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-text);
  }

  & .heading__secondary {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.3em;
    color: var(--color-muted);
  }

  & .heading__accent {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-accent);
    letter-spacing: 0.36em;
  }

  & .heading__rule {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--color-secondary);
  }

  & .heading__rule::before,
  & .heading__rule::after {
    content: '';
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.5;
  }

  & .heading__edition {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-secondary);
    letter-spacing: 0.26em;
  }
`;

const headingHeroStyle = css`
  gap: clamp(1rem, 4vw, 1.75rem);
  padding-bottom: clamp(2.5rem, 7vw, 3.75rem);

  & .heading__primary {
    font-size: clamp(2.6rem, 9vw, 4.5rem);
  }

  & .heading__secondary {
    font-size: clamp(1.15rem, 4vw, 2rem);
    letter-spacing: 0.34em;
  }

  & .heading__accent {
    font-size: clamp(1.5rem, 5vw, 2.6rem);
    letter-spacing: 0.4em;
  }

  & .heading__rule {
    margin-top: clamp(1.25rem, 5vw, 2rem);
  }

  & .heading__rule::before,
  & .heading__rule::after {
    opacity: 0.65;
  }

  & .heading__edition {
    margin-top: clamp(0.4rem, 2.5vw, 1rem);
    font-size: clamp(0.9rem, 2.5vw, 1.3rem);
    letter-spacing: 0.3em;
  }
`;

type FooterBadgeHeadingProps = {
  primary: string;
  secondary: string;
  accent: string;
  editionLabel: string;
  ariaLabel?: string;
  scale?: 'default' | 'hero';
};

export const FooterBadgeHeading = ({
  primary,
  secondary,
  accent,
  editionLabel,
  ariaLabel,
  scale = 'default',
}: FooterBadgeHeadingProps) => (
  <div class={cx(headingStyle, scale === 'hero' && headingHeroStyle)} aria-label={ariaLabel}>
    <span class="heading__primary">{primary}</span>
    <span class="heading__secondary">{secondary}</span>
    <span class="heading__accent">{accent}</span>
    <span class="heading__rule" aria-hidden="true"></span>
    <span class="heading__edition">{editionLabel}</span>
  </div>
);
