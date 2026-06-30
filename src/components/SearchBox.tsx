'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { WikiPage } from '@/lib/wiki';

export default function SearchBox({ pages }: { pages: Pick<WikiPage, 'slug' | 'title' | 'status' | 'type'>[] }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return pages.filter((page) => `${page.title} ${page.status} ${page.type}`.toLowerCase().includes(q)).slice(0, 8);
  }, [query, pages]);

  return (
    <div className="search-box codex-animate">
      <label htmlFor="wiki-search">Search the codex</label>
      <input id="wiki-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Grey, Unique, Výori…" />
      {results.length ? (
        <div className="search-results">
          {results.map((page) => (
            <Link href={`/wiki/${page.slug}`} key={page.slug}>{page.title}<small>{page.status}</small></Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
