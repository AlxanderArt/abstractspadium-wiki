'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AnimatedPageShell({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!root.current || reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.codex-animate', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out' });
      gsap.fromTo('.gold-rule', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.9, ease: 'power2.out', delay: 0.2 });
    }, root);
    return () => ctx.revert();
  }, []);

  return <div ref={root}>{children}</div>;
}
