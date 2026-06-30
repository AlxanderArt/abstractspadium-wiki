'use client';

import { useEffect, useState } from 'react';
import WikiSidebar from './WikiSidebar';
import LoadingVeil from './LoadingVeil';
import ThreeVoidScene from './ThreeVoidScene';
import type { WikiPage } from '@/lib/wiki';

type Group = { label: string; items: Pick<WikiPage, 'slug' | 'title' | 'status' | 'type'>[] };

export default function CodexLayout({ groups, activeSlug, children }: { groups: Group[]; activeSlug?: string; children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  return (
    <>
      <LoadingVeil />
      <ThreeVoidScene />
      <button className="mobile-nav-toggle" type="button" aria-expanded={navOpen} aria-controls="wiki-sidebar" onClick={() => setNavOpen((open) => !open)}>
        <span>{navOpen ? 'Close' : 'Codex'}</span>
      </button>
      {navOpen ? <button className="nav-scrim" aria-label="Close navigation" onClick={() => setNavOpen(false)} /> : null}
      <div className={`site-shell ${navOpen ? 'nav-open' : ''}`}>
        <WikiSidebar groups={groups} activeSlug={activeSlug} onNavigate={() => setNavOpen(false)} />
        <main className="main-panel">{children}</main>
      </div>
    </>
  );
}
