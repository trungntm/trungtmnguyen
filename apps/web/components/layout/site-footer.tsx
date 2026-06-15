import type { Dictionary } from '@/lib/i18n';

type SiteFooterProps = {
  dictionary: Dictionary;
};

export function SiteFooter({ dictionary }: SiteFooterProps) {
  return (
    <footer className="px-4 pb-10 pt-6 md:px-6">
      <div className="page-container border-t border-border/70 pt-6 text-sm text-muted">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>{dictionary.footer.primary}</p>
          <p>{dictionary.footer.secondary}</p>
        </div>
      </div>
    </footer>
  );
}
