import type { WikiPage } from './wiki';

export type CodexEntry = Pick<WikiPage, 'slug' | 'title' | 'status' | 'type'>;

export type CodexBucket = {
  label: string;
  entries: CodexEntry[];
};

const ALPHA_BUCKETS: Array<[string, RegExp]> = [
  ['A–F', /^[a-f]/i],
  ['G–M', /^[g-m]/i],
  ['N–Z', /^[n-z]/i],
  ['#', /^[^a-z]/i],
];

function bucketForTitle(title: string) {
  return ALPHA_BUCKETS.find(([, pattern]) => pattern.test(title.trim()))?.[0] ?? '#';
}

export function sortEntries(entries: CodexEntry[]): CodexEntry[] {
  return [...entries].sort((a, b) => a.title.localeCompare(b.title));
}

export function groupEntries(entries: CodexEntry[], largeThreshold = 12): CodexBucket[] {
  if (entries.length <= largeThreshold) return [{ label: '', entries }];

  const buckets = new Map<string, CodexEntry[]>();
  for (const entry of sortEntries(entries)) {
    const key = bucketForTitle(entry.title);
    buckets.set(key, [...(buckets.get(key) ?? []), entry]);
  }

  return ALPHA_BUCKETS
    .map(([label]) => ({ label, entries: buckets.get(label) ?? [] }))
    .filter((bucket) => bucket.entries.length > 0);
}

export function statusLabel(status: string) {
  return status.replace(/-/g, ' ');
}

export function statusClass(status: string) {
  return status.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
