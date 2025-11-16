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

export const homeHeroContent: HomeHeroContent = {
  showHeading: true,
  headingPrimary: 'Trying Anyway',
  headingSecondary: 'Tiny Experiments',
  headingAccent: 'Messy but Curious',
  editionLabel: 'Develop Edition',
  footerText: 'Crafted For Curious Minds',
  metaSections: [
    { label: 'IDEA SOURCE', value: 'HISTORICAL CONTEXT', variant: 'script' },
    { label: 'CRAFTED BY', value: 'tokec', variant: 'signature' },
    { label: 'STATE', value: 'IN PROGRESS', variant: 'script' },
  ],
  ariaLabel: 'Trying Anyway — Tiny Experiments — Messy but Curious',
  scale: 'hero',
};

export const homePageSettings = {
  showClock: true,
};
