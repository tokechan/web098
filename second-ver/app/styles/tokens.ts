import { css } from 'hono/css'

export const container = css`
  width: min(100%, var(--container-max));
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 5vw, 3.5rem);
`

export const cardSurface = css`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
`

export const sectionStack = css`
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
`

export const gridAutoCards = css`
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`

export const listReset = css`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const serifHeading = css`
  font-family: var(--font-serif);
  letter-spacing: var(--letter-spacing-wide);
`

export const mutedCopy = css`
  color: var(--color-muted);
`

export const linkReset = css`
  text-decoration: none;
  color: var(--color-accent);
  border-bottom: 1px solid transparent;
  transition: color .2s ease, border-color .2s ease;
  &:hover {
    color: var(--color-secondary);
    border-color: var(--color-secondary);
  }
`

export const pageShell = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

export const pageMain = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--page-gap);
  padding-block: var(--page-padding-top) var(--page-padding-bottom);
`

export const metaText = css`
  font-size: 0.82rem;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const tagPill = css`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  background: rgba(63, 112, 77, 0.12);
  color: var(--color-accent);
`
