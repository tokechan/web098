import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import { ProjectCard } from '../molecules/ProjectCard';
import type { ProjectSummary } from '../../lib/projects';
import { SectionHeader } from '../molecules/SectionHeader';

type LabsShowcaseProps = {
  projects: ProjectSummary[];
};

const section = css`
  display: grid;
  gap: 1.75rem;
`;

const grid = css`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

export const LabsShowcase: FC<LabsShowcaseProps> = ({ projects }) => (
  <section class={section} aria-label="Labs projects">
    <SectionHeader
      title="Labs & Hands-on"
      subtitle="Messy prototypes and quick experiments"
    />
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
