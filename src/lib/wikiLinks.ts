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

const CANON_LABELS: Record<string, string> = {
  abstractspadium: 'Abstractspadium',
  themelios: 'Thémelios',
  vyori: 'Výori',
  grey: 'Grey',
  theor: 'Théor',
  uss: 'The USS',
  'the-unique': 'The Unique',
  'descent-of-ignorance': 'The Descent of Ignorance',
  'the-ignorants': 'The Ignorants',
  ignorants: 'The Ignorants',
  incomprehensibles: 'The Incomprehensibles',
  transcendent: 'The Transcendent',
  'ai-dominance': 'AI Dominance',
  'algorithmic-dominion': 'The Algorithmic Dominion',
  'machine-hierarchy': 'The Machine Hierarchy',
  'synthetic-sovereignty': 'Synthetic Sovereignty',
  hebdomad: 'Hébdomad',
  fileith: 'Fileíth',
  'the-gray-mirror': 'The Gray Mirror',
  'the-center': 'The Center',
};

export function formatWikiLinkLabel(rawTarget: string): string {
  const slug = slugifyWikiTarget(rawTarget);
  if (CANON_LABELS[slug]) return CANON_LABELS[slug];

  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function transformWikiLinks(markdown: string): string {
  return markdown.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_match, rawTarget: string, rawLabel?: string) => {
    const slug = slugifyWikiTarget(rawTarget);
    const label = (rawLabel || formatWikiLinkLabel(rawTarget)).trim();
    return `[${label}](/wiki/${slug})`;
  });
}
