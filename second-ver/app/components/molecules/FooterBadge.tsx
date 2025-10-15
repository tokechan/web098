import { css, cx } from 'hono/css';
import type { JSX } from 'hono/jsx';
import { FooterBadgeHeading } from '../atoms/FooterBadgeHeading';

type BadgeSectionVariant = 'value' | 'script' | 'signature' | 'links';

type BadgeMetaSection = {
  label: string;
  value: string | JSX.Element;
  variant?: BadgeSectionVariant;
};

type FooterBadgeVariant = 'badge' | 'strip';

type FooterBadgeProps = {
  showHeading?: boolean;
  headingPrimary?: string;
  headingSecondary?: string;
  headingAccent?: string;
  editionLabel?: string;
  footerText?: string;
  metaSections?: BadgeMetaSection[];
  ariaLabel?: string;
  variant?: FooterBadgeVariant;
  scale?: 'default' | 'hero';
};

const baseStyle = css`
  position: relative;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text);

  & .badge__meta {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, auto);
    justify-content: center;
    align-items: center;
    gap: 1.4rem;
    text-transform: none;
    letter-spacing: 0.08em;
  }

  & .badge__metaItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: none;
    letter-spacing: 0.08em;
    position: relative;
    padding: 0 0.75rem;
  }

  & .badge__label {
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--color-muted);
    text-transform: uppercase;
  }

  & .badge__value {
    display: block;
    margin-top: 0.35rem;
    font-size: 1.35rem;
    font-family: var(--font-serif);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-text);
  }

  & .badge__value--script {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    color: var(--color-accent);
    letter-spacing: 0.06em;
  }

  & .badge__signature {
    display: block;
    margin-top: 0.35rem;
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    color: var(--color-accent);
    letter-spacing: 0.02em;
    text-transform: none;
  }

  & .badge__value--links {
    display: inline-flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    text-transform: none;
    letter-spacing: 0.05em;
    font-size: 1rem;
    flex-wrap: wrap;
  }

  & .badge__link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-accent);
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  & .badge__link:hover {
    color: var(--color-secondary);
  }

  & .badge__linkIcon {
    width: 20px;
    height: 20px;
    fill: currentColor;
    flex-shrink: 0;
  }

  & .badge__linkText {
    font-size: 0.8rem;
    letter-spacing: 0.12em;
  }

  & .badge__footer {
    margin-top: 1.2rem;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.3em;
  }
`;

const badgeVariantStyle = css`
  max-width: 420px;
  padding: 1.75rem 1.5rem 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 243, 239, 0.96));
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.04),
    0 12px 28px rgba(15, 15, 15, 0.12);
  background-blend-mode: multiply;

  &::before {
    content: '';
    position: absolute;
    inset: 0.75rem;
    border: 3px solid var(--color-accent);
    border-radius: 0.35rem;
    pointer-events: none;
  }
`;

const badgeCompactStyle = css`
  padding-top: 1.25rem;

  &::before {
    inset: 0.65rem;
  }

  & .badge__divider {
    margin-top: 0.5rem;
  }
`;

const stripVariantStyle = css`
  padding: 0;
  margin: 0;
  width: 100%;
  background: none;
  border: none;
  box-shadow: none;

  &::before {
    display: none;
  }


  & .badge__meta {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: clamp(1rem, 4vw, 2.5rem);
    letter-spacing: 0.05em;
    padding: 0 clamp(20px, 5vw, 60px);
  }

  & .badge__metaItem {
    align-items: flex-start;
    text-align: left;
    padding: 0;
    min-width: 180px;
    flex: 1 1 200px;
  }

  & .badge__label {
    letter-spacing: 0.12em;
    font-size: 0.7rem;
  }

  & .badge__value {
    font-size: 1.05rem;
    letter-spacing: 0.08em;
    text-transform: none;
  }

  & .badge__value--script {
    font-size: 1.05rem;
  }

  & .badge__signature {
    font-size: 1.05rem;
  }

  & .badge__footer {
    margin-top: 1.75rem;
    letter-spacing: 0.22em;
    font-size: 0.8rem;
  }
`;

const defaultMetaSections: BadgeMetaSection[] = [
  { label: 'Proof', value: '107', variant: 'script' },
  { label: 'Master Distiller', value: 'Chris Fletcher', variant: 'signature' },
  { label: 'Vol', value: '53.5%', variant: 'script' },
];

const badgeHeroScaleStyle = css`
  width: 100%;
  max-width: none;
  padding: clamp(2.5rem, 6vw, 3.5rem) clamp(2rem, 8vw, 4rem) clamp(2.25rem, 5vw, 3rem);

  &::before {
    inset: clamp(0.9rem, 2vw, 1.25rem);
  }

  & .badge__meta {
    gap: clamp(1.25rem, 4vw, 2.75rem);
  }

  & .badge__metaItem {
    padding: 0 clamp(0.75rem, 2.5vw, 1.5rem);
  }

  & .badge__label {
    font-size: clamp(0.55rem, 1.2vw, 0.9rem);
  }

  & .badge__value {
    font-size: clamp(1rem, 2.4vw, 2.2rem);
    letter-spacing: clamp(0.08em, 0.15em, 0.2em);
  }

  & .badge__value--script {
    font-size: clamp(1rem, 2.5vw, 2.3rem);
  }

  & .badge__signature {
    font-size: clamp(1rem, 2.4vw, 2.1rem);
  }

  & .badge__value--links {
    gap: clamp(0.75rem, 2vw, 1.5rem);
  }

  & .badge__linkIcon {
    width: clamp(18px, 2.5vw, 26px);
    height: clamp(18px, 2.5vw, 26px);
  }

  & .badge__linkText {
    font-size: clamp(0.72rem, 1.3vw, 0.95rem);
  }

  & .badge__footer {
    margin-top: clamp(1.25rem, 3vw, 2rem);
    font-size: clamp(0.75rem, 1.3vw, 1.1rem);
    letter-spacing: clamp(0.22em, 0.28em, 0.34em);
  }
`;

export const FooterBadge = ({
  showHeading = true,
  headingPrimary = 'Straight Tennessee Rye Whiskey',
  headingSecondary = 'Tennessee Travelers',
  headingAccent = 'Bold & Spicy',
  editionLabel = 'Limited Edition',
  footerText = '500ml',
  metaSections = defaultMetaSections,
  ariaLabel = 'Limited edition whiskey label graphic',
  variant = 'badge',
  scale = 'default',
}: FooterBadgeProps) => {
  const renderValue = (section: BadgeMetaSection) => {
    switch (section.variant) {
      case 'signature':
        return <span class="badge__signature">{section.value}</span>;
      case 'script':
        return <span class="badge__value badge__value--script">{section.value}</span>;
      case 'links':
        return <span class="badge__value badge__value--links">{section.value}</span>;
      default:
        return <span class="badge__value">{section.value}</span>;
    }
  };

  const metaItems = metaSections.map((section, index) => (
    <div class="badge__metaItem" key={`meta-${index}`}>
      <span class="badge__label">{section.label}</span>
      {renderValue(section)}
    </div>
  ));

  return (
    <section
      class={cx(
        baseStyle,
        variant === 'badge' ? badgeVariantStyle : stripVariantStyle,
        scale === 'hero' && variant === 'badge' && badgeHeroScaleStyle,
        !showHeading && variant === 'badge' && badgeCompactStyle
      )}
      aria-label={ariaLabel}
    >
      {showHeading && (
        <FooterBadgeHeading
          primary={headingPrimary}
          secondary={headingSecondary}
          accent={headingAccent}
          editionLabel={editionLabel}
          ariaLabel={`${headingPrimary} ${headingSecondary} ${headingAccent}`}
          scale={scale}
        />
      )}
      <div class="badge__divider" aria-hidden="true"></div>
      <div class="badge__meta">{metaItems}</div>
      <div class="badge__footer">{footerText}</div>
    </section>
  );
};
