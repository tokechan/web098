import { getAllLabs } from './labs';

export type ProjectSummary = {
  name: string;
  summary: string;
  tags?: string[];
  href?: string;
  status?: 'experiment' | 'published' | 'archived';
};

export const labsProjects: ProjectSummary[] = getAllLabs().map((lab) => ({
  name: lab.title,
  summary: lab.summary,
  tags: lab.tags,
  href: lab.url,
  status: (lab.status as ProjectSummary['status']) ?? 'experiment',
}));
