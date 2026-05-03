export function SiteFooter() {
  return (
    <footer className="px-4 pb-10 pt-6 md:px-6">
      <div className="page-container border-t border-border/70 pt-6 text-sm text-muted">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>
            Built for practical engineering notes, architecture write-ups, and technical essays.
          </p>
          <p>Powered by typed MDX, Content Collections, and the Next.js App Router.</p>
        </div>
      </div>
    </footer>
  );
}
