import type { BadgeMetaSection } from '../components/molecules/FooterBadge';

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

const moduleImport = import.meta.glob('../content/home/hero.mdx', {
  eager: true,
});

const heroData = (() => {
  const entry = Object.values(moduleImport)[0] as { frontmatter?: Record<string, unknown> } | undefined;
  const fm = entry?.frontmatter ?? {};
  const metaSections = (fm.metaSections as BadgeMetaSection[]) ?? [];
  return {
    showHeading: fm.showHeading ?? true,
    headingPrimary: (fm.title as string) ?? 'Trying Anyway',
    headingSecondary: (fm.secondary as string) ?? 'Tiny Experiments',
    headingAccent: (fm.accent as string) ?? 'Messy but Curious',
    editionLabel: (fm.edition as string) ?? 'Develop Edition',
    footerText: (fm.footer as string) ?? 'Crafted For Curious Minds',
    metaSections,
    ariaLabel: fm.ariaLabel ?? `${fm.title ?? 'Trying Anyway'} ${fm.secondary ?? 'Tiny Experiments'}`,
    scale: 'hero',
    showClock: fm.showClock ?? true,
  } satisfies HomeHeroContent & { showClock: boolean };
})();

export const homeHeroContent = heroData;
export const homePageSettings = {
  showClock: heroData.showClock,
};
