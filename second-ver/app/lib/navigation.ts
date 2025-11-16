import { paths } from './paths';

export type NavLink = {
  href: string;
  text: string;
};

export const primaryNavLinks: readonly NavLink[] = [
  { href: paths.home, text: 'Home' },
  { href: paths.blogs.list, text: 'Blogs' },
  { href: paths.labs.list, text: 'Labs' },
] as const;

export const siteBrand = {
  name: 'tokeC Room',
  homeHref: paths.home,
};
