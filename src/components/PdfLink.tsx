import Link from 'next/link';

export default function PdfLink() {
  return (
    <Link className="pdf-link codex-animate" href="/downloads/abstractspadium-codex-formatted.pdf" target="_blank">
      Open formatted codex PDF
    </Link>
  );
}
