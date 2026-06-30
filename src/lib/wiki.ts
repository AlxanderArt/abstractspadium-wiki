import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { transformWikiLinks, slugifyWikiTarget } from './wikiLinks';
import { navGroups } from './nav';

const WIKI_ROOT = path.join(process.cwd(), 'content', 'wiki');

export type WikiPage = {
  slug: string;
  route: string;
  filePath: string;
  folder: string;
  title: string;
  type: string;
  status: string;
  summary?: string;
  tags: string[];
  sources: string[];
  related: string[];
  rawContent: string;
  html: string;
};

type Frontmatter = {
  title?: string;
  type?: string;
  status?: string;
  summary?: string;
  definition?: string;
  tags?: string[];
  sources?: string[];
  related?: string[];
};

function titleCase(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith('_')) return [];
    if (entry.isDirectory()) return walk(full);
    if (/\.mdx?$/i.test(entry.name)) return [full];
    return [];
  });
}

function normalizeArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const withLinks = transformWikiLinks(markdown);
  const result = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(withLinks);
  return String(result);
}

export async function getAllWikiPages(): Promise<WikiPage[]> {
  const files = walk(WIKI_ROOT);
  const pages = await Promise.all(files.map(async (filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const data = parsed.data as Frontmatter;
    const slug = slugifyWikiTarget(path.basename(filePath));
    const rel = path.relative(WIKI_ROOT, filePath);
    const folder = rel.includes(path.sep) ? rel.split(path.sep)[0] : 'root';
    const html = await markdownToHtml(parsed.content);
    return {
      slug,
      route: `/wiki/${slug}`,
      filePath: rel,
      folder,
      title: data.title || titleCase(slug),
      type: data.type || folder,
      status: data.status || 'Draft',
      summary: data.summary || data.definition,
      tags: normalizeArray(data.tags),
      sources: normalizeArray(data.sources),
      related: normalizeArray(data.related),
      rawContent: parsed.content,
      html,
    } satisfies WikiPage;
  }));
  return pages.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getWikiPage(slug: string): Promise<WikiPage | undefined> {
  const pages = await getAllWikiPages();
  return pages.find((page) => page.slug === slug);
}

export async function getGroupedWikiPages() {
  const pages = await getAllWikiPages();
  const bySlug = new Map(pages.map((page) => [page.slug, page]));
  const used = new Set<string>();
  const groups = navGroups.map((group) => {
    const items = group.keys.map((key) => bySlug.get(key)).filter(Boolean) as WikiPage[];
    items.forEach((item) => used.add(item.slug));
    return { label: group.label, items };
  }).filter((group) => group.items.length > 0);
  const remaining = pages.filter((page) => !used.has(page.slug));
  if (remaining.length) groups.push({ label: 'Additional Pages', items: remaining });
  return groups;
}

export async function getRelatedPages(page: WikiPage): Promise<WikiPage[]> {
  const pages = await getAllWikiPages();
  const bySlug = new Map(pages.map((p) => [p.slug, p]));
  const linked = Array.from(page.rawContent.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g))
    .map((match) => slugifyWikiTarget(match[1]));
  const unique = Array.from(new Set([...page.related.map(slugifyWikiTarget), ...linked]));
  return unique
    .map((slug) => bySlug.get(slug))
    .filter((candidate): candidate is WikiPage => candidate !== undefined)
    .filter((candidate) => candidate.slug !== page.slug)
    .slice(0, 12);
}
