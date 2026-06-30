'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function LoadingVeil() {
  const veil = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setHidden(true);
      return;
    }
    const el = veil.current;
    if (!el) return;
    const tl = gsap.timeline({ onComplete: () => setHidden(true) });
    tl.fromTo('.veil-line', { scaleX: 0 }, { scaleX: 1, duration: 0.75, ease: 'power2.out' })
      .to(el, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, '+=0.15');
  }, []);

  if (hidden) return null;
  return (
    <div ref={veil} className="loading-veil" aria-hidden="true">
      <div className="veil-mark">ABSTRACTSPADIUM</div>
      <div className="veil-line" />
    </div>
  );
}
