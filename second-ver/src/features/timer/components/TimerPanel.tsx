import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import { useTimer } from '../../hooks/useTimer';

const panel = css`
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  font-family: var(--font-mono, var(--font-sans));
`;

const label = css`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-muted);
`;

const clock = css`
  font-size: 1rem;
  letter-spacing: 0.04em;
  color: var(--color-text);
`;

export const TimerPanel: FC<{ intervalMs?: number }> = ({ intervalMs }) => {
  const { formatted } = useTimer(intervalMs);

  return (
    <section class={panel} aria-live="polite">
      <span class={label}>Current Time</span>
      <time class={clock}>{formatted}</time>
    </section>
  );
};
