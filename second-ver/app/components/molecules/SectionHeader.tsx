import { css } from 'hono/css';
import type { FC } from 'hono/jsx';

type SectionCTA = {
  label: string;
  href: string;
};

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  cta?: SectionCTA;
};

const headerClass = css`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const titleClass = css`
  font-size: clamp(1.4rem, 2.8vw, 1.8rem);
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const subtitleClass = css`
  font-size: 0.9rem;
  color: var(--color-muted);
  letter-spacing: 0.08em;
`;

const asideClass = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-left: auto;
`;

const ctaClass = css`
  font-size: 0.86rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 120ms ease, color 120ms ease;

  &:hover {
    color: var(--color-secondary);
    border-color: currentColor;
  }
`;

export const SectionHeader: FC<SectionHeaderProps> = ({ title, subtitle, cta }) => (
  <div class={headerClass}>
    <h2 class={titleClass}>{title}</h2>
    {(subtitle || cta) && (
      <div class={asideClass}>
        {subtitle && <p class={subtitleClass}>{subtitle}</p>}
        {cta && (
          <a class={ctaClass} href={cta.href}>
            {cta.label}
          </a>
        )}
      </div>
    )}
  </div>
);
