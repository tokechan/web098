import { css } from 'hono/css'

export const container = css`
  width: min(100%, var(--container-max));
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 5vw, 3.5rem);
  clamp(1.25rem, 5vw, 3.5rem);
`

export const card = css`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
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
