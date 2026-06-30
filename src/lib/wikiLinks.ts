export function slugifyWikiTarget(input: string): string {
  return input
    .trim()
    .replace(/\\/g, '/')
    .split('/')
    .pop()!
    .replace(/\.mdx?$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9\-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function transformWikiLinks(markdown: string): string {
  return markdown.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_match, rawTarget: string, rawLabel?: string) => {
    const slug = slugifyWikiTarget(rawTarget);
    const label = (rawLabel || rawTarget).trim();
    return `[${label}](/wiki/${slug})`;
  });
}
