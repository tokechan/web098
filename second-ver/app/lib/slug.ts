export const toSlug = (path: string) => 
    (path.split('/content/blog/')[1] ?? path).replace(/\.mdx$/, '');