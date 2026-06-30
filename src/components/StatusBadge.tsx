export default function StatusBadge({ status, type }: { status?: string; type?: string }) {
  const normalized = (status || 'Draft').toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="badge-row codex-animate" aria-label="Page metadata">
      <span className={`status-badge ${normalized}`}>{status || 'Draft'}</span>
      {type ? <span className="type-badge">{type}</span> : null}
    </div>
  );
}
