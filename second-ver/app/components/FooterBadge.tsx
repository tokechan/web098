import { css } from 'hono/css';

const badgeStyle = css`
  position: relative;
  margin: 0 auto;
  padding: 1.75rem 1.5rem 1.5rem;
  max-width: 420px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(245, 243, 239, 0.96));
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(0, 0, 0, 0.04),
    0 12px 28px rgba(15, 15, 15, 0.12);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text);
  background-blend-mode: multiply;

  &::before {
    content: '';
    position: absolute;
    inset: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 0.35rem;
    pointer-events: none;
  }

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
    background:
      linear-gradient(to right, transparent 0%, var(--color-accent) 35%, var(--color-accent) 65%, transparent 100%);
  }

  & .badge__meta {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto 1fr;
    align-items: center;
    gap: 0.75rem;
    text-transform: none;
    letter-spacing: 0.08em;
  }

  & .badge__label {
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--color-muted);
  }

  & .badge__value {
    display: block;
    margin-top: 0.35rem;
    font-size: 1.35rem;
    font-family: var(--font-serif);
    text-transform: uppercase;
    letter-spacing: 0.12em;
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

  & .badge__separator {
    width: 1px;
    height: 48px;
    background: linear-gradient(180deg, transparent, var(--color-border), transparent);
  }

  & .badge__footer {
    margin-top: 1.2rem;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.3em;
  }
`;

export const FooterBadge = () => (
  <section class={badgeStyle} aria-label="Limited edition whiskey label graphic">
    <div class="badge__title">Straight Tennessee Rye Whiskey</div>
    <div class="badge__limited">
      <span class="badge__flourish" aria-hidden="true"></span>
      <span>Limited</span>
      <span class="badge__dot">•</span>
      <span>Edition</span>
      <span class="badge__flourish badge__flourish--right" aria-hidden="true"></span>
    </div>
    <div class="badge__divider" aria-hidden="true"></div>
    <div class="badge__meta">
      <div>
        <span class="badge__label">Proof</span>
        <span class="badge__value badge__value--script">107</span>
      </div>
      <div class="badge__separator" aria-hidden="true"></div>
      <div>
        <span class="badge__label">Master Distiller</span>
        <span class="badge__signature">Chris Fletcher</span>
      </div>
      <div class="badge__separator" aria-hidden="true"></div>
      <div>
        <span class="badge__label">Vol</span>
        <span class="badge__value badge__value--script">53.5%</span>
      </div>
    </div>
    <div class="badge__footer">500ml</div>
  </section>
);

