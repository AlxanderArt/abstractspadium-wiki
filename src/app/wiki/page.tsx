import Link from 'next/link';
import CodexLayout from '@/components/CodexLayout';
import AnimatedPageShell from '@/components/AnimatedPageShell';
import { getAllWikiPages, getGroupedWikiPages } from '@/lib/wiki';

export default async function WikiIndex() {
  const groups = await getGroupedWikiPages();
  const pages = await getAllWikiPages();
  return (
    <CodexLayout groups={groups}>
      <AnimatedPageShell>
        <section className="page-head">
          <p className="eyebrow codex-animate">INDEX</p>
          <h1 className="codex-animate">Wiki Pages</h1>
          <div className="gold-rule" />
          <p className="page-summary codex-animate">Browse the current Abstractspadium canon, working canon, needs-review pages, and source summaries.</p>
        </section>
        <section className="page-list codex-animate">
          {pages.map((page) => (
            <Link key={page.slug} href={`/wiki/${page.slug}`}>
              <strong>{page.title}</strong>
              <span>{page.type} · {page.status}</span>
            </Link>
          ))}
        </section>
      </AnimatedPageShell>
    </CodexLayout>
  );
}
