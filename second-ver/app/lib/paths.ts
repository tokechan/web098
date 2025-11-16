
export const paths = {
  home: '/',
  blogs: {
    list: '/blogs',
    detail: (slug: string) => `/blogs/${slug}`,
  },
  labs: {
    list: '/labs',
    detail: (slug: string) => `/labs/${slug}`,
  },
} as const;

export const postUrl = (slug: string) => paths.blogs.detail(slug);
export const labUrl = (slug: string) => paths.labs.detail(slug);
