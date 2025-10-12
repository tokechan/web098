import { css, cx } from 'hono/css';
import type { JSX } from 'hono/jsx';

type BadgeSectionVariant = 'value' | 'script' | 'signature' | 'links';

type BadgeMetaSection = {
  label: string;
  value: string | JSX.Element;
  variant?: BadgeSectionVariant;
};

type FooterBadgeVariant = 'badge' | 'strip';

type FooterBadgeProps = {
  showHeading?: boolean;
  title?: string;
  limitedLabel?: string;
  editionLabel?: string;
  footerText?: string;
  metaSections?: BadgeMetaSection[];
  ariaLabel?: string;
  variant?: FooterBadgeVariant;
};

const baseStyle = css`
  position: relative;
  margin: 0 auto;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text);

  & .badge__title {
    font-family: var(--font-serif);
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  & .badge__limited {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.3em;
    color: var(--color-secondary);
  }

  & .badge__dot {
    font-size: 0.65rem;
    letter-spacing: 0;
  }

  & .badge__flourish {
    display: inline-flex;
    width: 82px;
    height: 18px;
    background: currentColor;
    mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="164" height="36" viewBox="0 0 164 36" fill="none"><path d="M3.5 35C29 1.5 135.5 1 160.5 35" stroke="black" stroke-width="6" stroke-linecap="round"/></svg>') center / contain no-repeat;
    opacity: 0.65;
  }

  & .badge__flourish--right {
    transform: scaleX(-1);
  }

  & .badge__divider {
    margin: 1.25rem auto 1.1rem;
    height: 1px;
    width: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--color-accent) 35%,
      var(--color-accent) 65%,
      transparent 100%
    );
  }

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

  & .badge__metaItem:not(:first-child)::before {
    content: '';
    position: absolute;
    left: -0.75rem;
    top: -0.5rem;
    bottom: -0.5rem;
    width: 1px;
    background: linear-gradient(180deg, transparent, var(--color-border), transparent);
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
  padding: 1.75rem 1.5rem 1.5rem;
  max-width: 420px;
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
    border: 1px solid rgba(0, 0, 0, 0.06);
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
  padding: 2rem 0 1.5rem;
  margin: 0;
  width: 100%;
  max-width: 880px;
  background: none;
  border: none;
  box-shadow: none;

  &::before {
    display: none;
  }

  & .badge__divider {
    width: 100%;
    margin: 0 0 1.75rem;
    height: 2px;
    background: var(--color-accent);
  }

  & .badge__meta {
    width: 100%;
    grid-template-columns: minmax(0, 2fr) minmax(0, 6fr) minmax(0, 2fr);
    gap: 0;
    letter-spacing: 0.05em;
  }

  & .badge__metaItem {
    align-items: center;
    padding: 0 1rem;
  }

  & .badge__metaItem:not(:first-child)::before {
    left: 0;
    top: -0.75rem;
    bottom: -0.75rem;
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

export const FooterBadge = ({
  showHeading = true,
  title = 'Straight Tennessee Rye Whiskey',
  limitedLabel = 'Limited',
  editionLabel = 'Edition',
  footerText = '500ml',
  metaSections = defaultMetaSections,
  ariaLabel = 'Limited edition whiskey label graphic',
  variant = 'badge',
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
        !showHeading && variant === 'badge' && badgeCompactStyle
      )}
      aria-label={ariaLabel}
    >
      {showHeading && (
        <>
          <div class="badge__title">{title}</div>
          <div class="badge__limited">
            <span class="badge__flourish" aria-hidden="true"></span>
            <span>{limitedLabel}</span>
            <span class="badge__dot">•</span>
            <span>{editionLabel}</span>
            <span class="badge__flourish badge__flourish--right" aria-hidden="true"></span>
          </div>
        </>
      )}
      <div class="badge__divider" aria-hidden="true"></div>
      <div class="badge__meta">{metaItems}</div>
      <div class="badge__footer">{footerText}</div>
    </section>
  );
};
