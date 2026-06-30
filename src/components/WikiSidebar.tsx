'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { WikiPage } from '@/lib/wiki';

type NavEntry = Pick<WikiPage, 'slug' | 'title' | 'status' | 'type'>;
type Group = { label: string; items: NavEntry[] };

type Bucket = {
  label: string;
  items: NavEntry[];
};

const LARGE_SECTION_THRESHOLD = 12;
const ALPHA_BUCKETS: Array<[string, RegExp]> = [
  ['A–F', /^[a-f]/i],
  ['G–M', /^[g-m]/i],
  ['N–Z', /^[n-z]/i],
  ['#', /^[^a-z]/i],
];

function bucketForTitle(title: string) {
  return ALPHA_BUCKETS.find(([, pattern]) => pattern.test(title.trim()))?.[0] ?? '#';
}

function groupItems(items: NavEntry[]): Bucket[] {
  const sorted = [...items].sort((a, b) => a.title.localeCompare(b.title));
  if (sorted.length <= LARGE_SECTION_THRESHOLD) return [{ label: '', items: sorted }];

  const buckets = new Map<string, NavEntry[]>();
  for (const item of sorted) {
    const key = bucketForTitle(item.title);
    buckets.set(key, [...(buckets.get(key) ?? []), item]);
  }

  return ALPHA_BUCKETS.map(([label]) => ({ label, items: buckets.get(label) ?? [] })).filter((bucket) => bucket.items.length > 0);
}

function statusLabel(status: string) {
  return status.replace(/-/g, ' ');
}

function statusClass(status: string) {
  return status.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function WikiSidebar({ groups, activeSlug, onNavigate }: { groups: Group[]; activeSlug?: string; onNavigate?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [query, setQuery] = useState('');
  const [closedSections, setClosedSections] = useState<Set<string>>(() => new Set(groups.filter((group) => group.label !== 'Start Here').map((group) => group.label)));
  const normalizedQuery = query.trim().toLowerCase();

  const visibleGroups = useMemo(() => {
    return groups
      .map((group) => {
        const items = normalizedQuery
          ? group.items.filter((item) => `${item.title} ${item.status} ${item.type}`.toLowerCase().includes(normalizedQuery))
          : group.items;
        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, normalizedQuery]);

  useEffect(() => {
    if (!activeSlug || normalizedQuery) return;
    const activeGroup = groups.find((group) => group.items.some((item) => item.slug === activeSlug));
    if (!activeGroup) return;
    setClosedSections((current) => {
      if (!current.has(activeGroup.label)) return current;
      const next = new Set(current);
      next.delete(activeGroup.label);
      return next;
    });
  }, [activeSlug, groups, normalizedQuery]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ref.current || reduce) return;
    const items = ref.current.querySelectorAll('.nav-link');
    gsap.fromTo(items, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.015, ease: 'power2.out' });
  }, []);

  const toggleSection = (label: string) => {
    setClosedSections((current) => {
      const next = new Set(current);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <aside id="wiki-sidebar" ref={ref} className="sidebar" aria-label="Abstractspadium wiki navigation">
      <Link className="brand" href="/" onClick={onNavigate}>
        <span className="brand-kicker">THE CODEX OF</span>
        <span>Abstractspadium</span>
      </Link>

      <label className="nav-filter">
        <span>Filter entries</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the codex…"
          aria-label="Filter wiki navigation entries"
        />
      </label>

      <nav className="codex-nav" aria-label="Codex sections">
        {visibleGroups.map((group) => {
          const hasActive = group.items.some((item) => item.slug === activeSlug);
          const isOpen = normalizedQuery ? true : !closedSections.has(group.label) || hasActive;
          const buckets = groupItems(group.items);

          return (
            <section key={group.label} className={`nav-group ${hasActive ? 'has-active' : ''}`}>
              <button
                className="nav-group-toggle"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`nav-section-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                onClick={() => toggleSection(group.label)}
              >
                <span>{group.label}</span>
                <span className="nav-group-count">{group.items.length}</span>
                <span className={`nav-chevron ${isOpen ? 'open' : ''}`} aria-hidden>›</span>
              </button>

              {isOpen ? (
                <div id={`nav-section-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="nav-group-body">
                  {buckets.map((bucket) => (
                    <div key={bucket.label || group.label} className="nav-subgroup">
                      {bucket.label ? <p className="nav-subgroup-label">{bucket.label}</p> : null}
                      {bucket.items.map((item) => {
                        const active = activeSlug === item.slug;
                        return (
                          <Link
                            key={item.slug}
                            className={`nav-link ${active ? 'active' : ''}`}
                            href={`/wiki/${item.slug}`}
                            aria-current={active ? 'page' : undefined}
                            onClick={onNavigate}
                          >
                            <span className="nav-link-title">{item.title}</span>
                            <span className={`nav-status-dot ${statusClass(item.status)}`} title={statusLabel(item.status)} aria-label={statusLabel(item.status)} />
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
