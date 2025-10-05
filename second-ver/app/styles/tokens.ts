import { css } from 'hono/css';

export const tokens = css`
  --container-max: 48rem;
  --space-1: .25rem;
  --space-2: .5rem;
  --space-3: .75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;    /* 20px 推奨 */
  --space-6: 1.5rem;     /* 24px */
  --space-7: 2rem;
  --space-8: 2.5rem;
  --space-9: 3rem;

  --radius-sm: .25rem;
  --radius-md: .375rem;
  --radius-lg: .5rem;

  --border-strong: 3px;
  --color-border: rgba(0, 0, 71, 0.83);
  --color-link:   rgba(30, 30, 203, 0.83);
  --color-text:   rgba(28, 28, 151, 0.83);
  --color-muted:  rgba(43, 48, 73, 0.66);
`;
