export type ProjectSummary = {
  name: string;
  summary: string;
  tags?: string[];
  href?: string;
  status?: 'experiment' | 'published' | 'archived';
};

export const labsProjects: ProjectSummary[] = [
  {
    name: 'Edge Forms',
    summary: 'Workers KV で完結するフォーム送信ミニフレームワーク。バックエンド不要の実験版。',
    tags: ['cloudflare', 'forms', 'edge'],
    href: '/labs/edge-forms',
    status: 'experiment',
  },
  {
    name: 'Readable MDX',
    summary: 'MDX ブログを読みやすくするタイポグラフィ調整＆テーマ切り替えの試験実装。',
    tags: ['mdx', 'design system'],
    href: '/labs/readable-mdx',
    status: 'experiment',
  },
  {
    name: 'Prompt Trail',
    summary: 'プロンプトの変遷をバージョン管理できるミニ UI。LLM の試行錯誤ログを可視化。',
    tags: ['ai', 'tooling'],
    href: '/labs/prompt-trail',
    status: 'published',
  },
];
