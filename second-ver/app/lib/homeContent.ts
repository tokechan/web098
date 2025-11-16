import type { BadgeMetaSection } from '../components/molecules/FooterBadge';
import type { PostModule } from '../types/mdx';

export type HomeHeroContent = {
  showHeading?: boolean;
  headingPrimary: string;
  headingSecondary?: string;
  headingAccent?: string;
  editionLabel?: string;
  footerText?: string;
  metaSections?: BadgeMetaSection[];
  ariaLabel?: string;
  scale?: 'default' | 'hero';
};

type HeroFrontmatter = {
  title?: string;
  secondary?: string;
  accent?: string;
  edition?: string;
  footer?: string;
  showClock?: boolean;
  showHeading?: boolean;
  ariaLabel?: string;
  metaSections?: BadgeMetaSection[];
};

const modules = import.meta.glob<PostModule>('../content/home/hero.mdx', {
  eager: true,
});

const heroEntry = Object.values(modules)[0] as { frontmatter?: HeroFrontmatter } | undefined;
const fm: HeroFrontmatter = heroEntry?.frontmatter ?? {};

const heroContent: HomeHeroContent = {
  showHeading: fm.showHeading ?? true,
  headingPrimary: fm.title ?? 'Trying Anyway',
  headingSecondary: fm.secondary ?? 'Tiny Experiments',
  headingAccent: fm.accent ?? 'Messy but Curious',
  editionLabel: fm.edition ?? 'Develop Edition',
  footerText: fm.footer ?? 'Crafted For Curious Minds',
  metaSections: fm.metaSections ?? [],
  ariaLabel: fm.ariaLabel ?? `${fm.title ?? 'Trying Anyway'} ${fm.secondary ?? 'Tiny Experiments'}`,
  scale: 'hero',
};

const showClock = fm.showClock ?? true;

export const homeHeroContent = heroContent;
export const homePageSettings = { showClock };
