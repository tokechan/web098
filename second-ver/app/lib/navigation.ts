export type NavLink = {
  href: string;
  text: string;
};

export const primaryNavLinks: readonly NavLink[] = [
  { href: '/', text: 'Home' },
  { href: '/blogs', text: 'Blogs' },
  { href: '/labs', text: 'Labs' },
] as const;

export const siteBrand = {
  name: 'tokeC Room',
  homeHref: '/',
};
