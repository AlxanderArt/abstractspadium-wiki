import WikiSidebar from './WikiSidebar';
import LoadingVeil from './LoadingVeil';
import ThreeVoidScene from './ThreeVoidScene';
import type { WikiPage } from '@/lib/wiki';

type Group = { label: string; items: Pick<WikiPage, 'slug' | 'title' | 'status' | 'type'>[] };

export default function CodexLayout({ groups, activeSlug, children }: { groups: Group[]; activeSlug?: string; children: React.ReactNode }) {
  return (
    <>
      <LoadingVeil />
      <ThreeVoidScene />
      <div className="site-shell">
        <WikiSidebar groups={groups} activeSlug={activeSlug} />
        <main className="main-panel">{children}</main>
      </div>
    </>
  );
}
