import { css } from 'hono/css';
import type { FC } from 'hono/jsx';

type ProjectCardProps = {
  name: string;
  summary: string;
  tags?: string[];
  href?: string;
  status?: 'experiment' | 'published' | 'archived';
};

const card = css`
  padding: 1.25rem 1.35rem;
  border-radius: 1rem;
  border: 1px solid rgba(63, 112, 77, 0.2);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 247, 244, 0.96));
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 140ms ease, box-shadow 140ms ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 36px rgba(52, 70, 60, 0.18);
  }
`;

const nameStyle = css`
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-size: 1.1rem;
  font-weight: 650;
  letter-spacing: 0.04em;

  & a {
    color: var(--color-text);
    text-decoration: none;
  }

  & a:hover {
    color: var(--color-accent);
  }
`;

const summaryStyle = css`
  font-size: 0.92rem;
  color: var(--color-muted);
  line-height: 1.55;
`;

const tagsWrap = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const tagStyle = css`
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
`;

const statusStyle = css`
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(63, 112, 77, 0.72);
`;

const statusLabel: Record<Required<ProjectCardProps>['status'], string> = {
  experiment: 'Experiment',
  published: 'Launched',
  archived: 'Archived',
};

export const ProjectCard: FC<ProjectCardProps> = ({
  name,
  summary,
  tags,
  href,
  status = 'experiment',
}) => (
  <article class={card}>
    <h3 class={nameStyle}>
      {href ? <a href={href}>{name}</a> : name}
      <span class={statusStyle}>{statusLabel[status]}</span>
    </h3>
    <p class={summaryStyle}>{summary}</p>
    {tags && tags.length > 0 && (
      <div class={tagsWrap}>
        {tags.map((tag) => (
          <span key={tag} class={tagStyle}>
            {tag}
          </span>
        ))}
      </div>
    )}
  </article>
);
