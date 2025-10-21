import { css, cx } from 'hono/css';
import { createRoute } from 'honox/factory';
import { LabsShowcase } from '../../components/organisms/LabsShowcase';
import { labsProjects } from '../../lib/projects';
import { container } from '../../styles/tokens';

const page = css`
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 5vw, 3.5rem);
  padding-block: clamp(3rem, 8vw, 5rem);
`;

const title = css`
  font-size: clamp(1.5rem, 3vw, 2rem);
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export default createRoute((c) =>
  c.render(
    <main class={cx(container, page)}>
      <h1 class={title}>Labs</h1>
      <LabsShowcase projects={labsProjects} />
    </main>
  )
);
