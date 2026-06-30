import { notFound } from 'next/navigation';
import Link from 'next/link';
import CodexLayout from '@/components/CodexLayout';
import AnimatedPageShell from '@/components/AnimatedPageShell';
import StatusBadge from '@/components/StatusBadge';
import PdfLink from '@/components/PdfLink';
import { getAllWikiPages, getGroupedWikiPages, getRelatedPages, getWikiPage } from '@/lib/wiki';

export async function generateStaticParams() {
  const pages = await getAllWikiPages();
  return pages.map((page) => ({ slug: [page.slug] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await getWikiPage(slug.at(-1) || '');
  return { title: page ? `${page.title} · Abstractspadium Wiki` : 'Abstractspadium Wiki' };
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = await getWikiPage(slug.at(-1) || '');
  if (!page) notFound();
  const groups = await getGroupedWikiPages();
  const related = await getRelatedPages(page);

  return (
    <CodexLayout groups={groups} activeSlug={page.slug}>
      <AnimatedPageShell>
        <article className="wiki-page">
          <StatusBadge status={page.status} type={page.type} />
          <header className="page-head">
            <p className="eyebrow codex-animate">{page.filePath}</p>
            <h1 className="codex-animate">{page.title}</h1>
            <div className="gold-rule" />
            {page.summary ? <p className="page-summary codex-animate">{page.summary}</p> : null}
          </header>
          <div className="wiki-content codex-animate" dangerouslySetInnerHTML={{ __html: page.html }} />
          <footer className="wiki-footer codex-animate">
            <PdfLink />
            {page.sources.length ? <p className="sources"><strong>Sources:</strong> {page.sources.join(', ')}</p> : null}
            {related.length ? (
              <section className="related">
                <h2>Related pages</h2>
                <div>
                  {related.map((item) => <Link key={item.slug} href={`/wiki/${item.slug}`}>{item.title}</Link>)}
                </div>
              </section>
            ) : null}
          </footer>
        </article>
      </AnimatedPageShell>
    </CodexLayout>
  );
}
