'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { WikiPage } from '@/lib/wiki';

type Group = { label: string; items: Pick<WikiPage, 'slug' | 'title' | 'status' | 'type'>[] };

export default function WikiSidebar({ groups, activeSlug }: { groups: Group[]; activeSlug?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ref.current || reduce) return;
    const items = ref.current.querySelectorAll('.nav-link');
    gsap.fromTo(items, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.015, ease: 'power2.out' });
  }, []);

  return (
    <aside ref={ref} className="sidebar" aria-label="Abstractspadium wiki navigation">
      <Link className="brand" href="/">
        <span className="brand-kicker">THE CODEX OF</span>
        <span>Abstractspadium</span>
      </Link>
      <nav>
        {groups.map((group) => (
          <section key={group.label} className="nav-group">
            <h2>{group.label}</h2>
            {group.items.map((item) => (
              <Link key={item.slug} className={`nav-link ${activeSlug === item.slug ? 'active' : ''}`} href={`/wiki/${item.slug}`}>
                <span>{item.title}</span>
                <small>{item.status}</small>
              </Link>
            ))}
          </section>
        ))}
      </nav>
    </aside>
  );
}
