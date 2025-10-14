import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import { ProjectCard } from '../molecules/ProjectCard';
import type { ProjectSummary } from '../../lib/projects';

type LabsShowcaseProps = {
  projects: ProjectSummary[];
};

const section = css`
  display: grid;
  gap: 1.75rem;
`;

const heading = css`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const title = css`
  font-size: clamp(1.4rem, 2.8vw, 1.8rem);
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const subtitle = css`
  font-size: 0.9rem;
  color: var(--color-muted);
  letter-spacing: 0.08em;
`;

const grid = css`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

export const LabsShowcase: FC<LabsShowcaseProps> = ({ projects }) => (
  <section class={section} aria-label="Labs projects">
    <div class={heading}>
      <h2 class={title}>Labs & Hands-on</h2>
      <p class={subtitle}>Messy prototypes and quick experiments</p>
    </div>
    <div class={grid}>
      {projects.length === 0 ? (
        <p>実験中のプロジェクトは準備中です。</p>
      ) : (
        projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))
      )}
    </div>
  </section>
);
