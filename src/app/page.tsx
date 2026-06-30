import Link from 'next/link';
import CodexLayout from '@/components/CodexLayout';
import AnimatedPageShell from '@/components/AnimatedPageShell';
import PdfLink from '@/components/PdfLink';
import SearchBox from '@/components/SearchBox';
import { getAllWikiPages, getGroupedWikiPages } from '@/lib/wiki';

export default async function Home() {
  const groups = await getGroupedWikiPages();
  const pages = await getAllWikiPages();
  const featured = ['abstractspadium', 'grey', 'the-unique', 'vyori', 'places']
    .map((slug) => pages.find((page) => page.slug === slug))
    .filter(Boolean) as typeof pages;

  return (
    <CodexLayout groups={groups}>
      <AnimatedPageShell>
        <section className="hero">
          <p className="eyebrow codex-animate">THE LIVING CODEX</p>
          <h1 className="codex-animate">Abstractspadium</h1>
          <div className="gold-rule" />
          <p className="hero-copy codex-animate">A space drawn away from physical reality — where concepts, meaning, and will become terrain.</p>
          <div className="hero-actions codex-animate">
            <Link className="primary-link" href="/wiki/abstractspadium">Enter the wiki</Link>
            <PdfLink />
          </div>
        </section>
        <SearchBox pages={pages} />
        <section className="card-grid codex-animate" aria-label="Start here pages">
          {featured.map((page) => (
            <Link key={page.slug} href={`/wiki/${page.slug}`} className="codex-card">
              <span>{page.type}</span>
              <h2>{page.title}</h2>
              <p>{page.summary || page.status}</p>
            </Link>
          ))}
        </section>
      </AnimatedPageShell>
    </CodexLayout>
  );
}
