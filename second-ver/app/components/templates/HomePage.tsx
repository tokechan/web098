import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import type { PostSummary } from '../../lib/posts';
import { FooterBadge } from '../molecules/FooterBadge';
import Time from '../atoms/$Time';
import { LatestPosts } from '../organisms/LatestPosts';
import { LabsShowcase } from '../organisms/LabsShowcase';
import type { ProjectSummary } from '../../lib/projects';
import type { HomeHeroContent } from '../../lib/homeContent';
import { homeHeroContent as defaultHeroContent } from '../../lib/homeContent';
import { heroSection, heroTitle, heroMeta } from '../../styles/tokens';

const wrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(3rem, 6vw, 5rem);
`;

const timeStyle = css`
  font-size: 0.85rem;
  color: var(--color-muted);
  letter-spacing: 0.08em;
  text-align: center;
`;

type HomePageProps = {
  /**
   * Toggle the real-time clock display above the hero badge.
   */
  showClock?: boolean;
  latestPosts: PostSummary[];
  projects: ProjectSummary[];
  heroContent?: HomeHeroContent;
};

export const HomePage: FC<HomePageProps> = ({
  showClock = false,
  latestPosts,
  projects,
  heroContent = defaultHeroContent,
}) => (
  <div class={wrapperStyle}>
    {showClock && (
      <div class={timeStyle}>
        <Time />
      </div>
    )}
    <section class={heroSection}>
      <h1 class={heroTitle}>{heroContent.headingPrimary}</h1>
      {heroContent.headingSecondary && (
        <p class={heroMeta}>{heroContent.headingSecondary}</p>
      )}
      <FooterBadge {...heroContent} />
    </section>
    <LatestPosts posts={latestPosts} />
    <LabsShowcase projects={projects} />
  </div>
);
