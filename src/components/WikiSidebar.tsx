'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { WikiPage } from '@/lib/wiki';
import { groupEntries, statusClass, statusLabel, type CodexEntry } from '@/lib/groupEntries';

type Group = { label: string; items: CodexEntry[] };

function groupDomId(label: string) {
  return `nav-section-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function sectionHref(group: Group) {
  const first = group.items[0];
  return first ? `/wiki/${first.slug}` : '/wiki';
}

export default function WikiSidebar({ groups, activeSlug, onNavigate }: { groups: Group[]; activeSlug?: string; onNavigate?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [query, setQuery] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['Start Here']));
  const normalizedQuery = query.trim().toLowerCase();

  const activeGroupLabel = useMemo(() => {
    return groups.find((group) => group.items.some((item) => item.slug === activeSlug))?.label;
  }, [activeSlug, groups]);

  useEffect(() => {
    if (!activeGroupLabel || normalizedQuery) return;
    setOpenSections((current) => {
      if (current.has(activeGroupLabel)) return current;
      const next = new Set(current);
      next.add(activeGroupLabel);
      return next;
    });
  }, [activeGroupLabel, normalizedQuery]);

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
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ref.current || reduce) return;
    const items = ref.current.querySelectorAll('.nav-link, .nav-section-link');
    gsap.fromTo(items, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.012, ease: 'power2.out' });
  }, []);

  const toggleSection = (label: string) => {
    setOpenSections((current) => {
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
          const hasActive = group.label === activeGroupLabel || group.items.some((item) => item.slug === activeSlug);
          const isOpen = normalizedQuery ? true : openSections.has(group.label) || hasActive;
          const buckets = groupEntries(group.items);
          const sectionId = groupDomId(group.label);

          return (
            <section key={group.label} className={`nav-group ${hasActive ? 'has-active' : ''}`}>
              <div className="nav-section-header">
                <Link className="nav-section-link" href={sectionHref(group)} onClick={onNavigate}>
                  <span>{group.label}</span>
                  <small>{group.items.length}</small>
                </Link>
                <button
                  className="nav-section-toggle"
                  type="button"
                  aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${group.label}`}
                  aria-expanded={isOpen}
                  aria-controls={sectionId}
                  onClick={() => toggleSection(group.label)}
                >
                  <span className={`nav-chevron ${isOpen ? 'open' : ''}`} aria-hidden>›</span>
                </button>
              </div>

              {isOpen ? (
                <div id={sectionId} className="nav-group-body">
                  {buckets.map((bucket) => (
                    <div key={bucket.label || group.label} className="nav-subgroup">
                      {bucket.label ? <p className="nav-subgroup-label">{bucket.label}</p> : null}
                      {bucket.entries.map((item) => {
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
