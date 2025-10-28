export const toSlug = (path: string) => {
  const relative = path.split('/content/blog/')[1] ?? path;
  const withoutExt = relative.replace(/\.mdx$/, '');
  const filename = withoutExt.split('/').pop() ?? withoutExt;
  const withoutDatePrefix = filename.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '');
  return withoutDatePrefix;
};
