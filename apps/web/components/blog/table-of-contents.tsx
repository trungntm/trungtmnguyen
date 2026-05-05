import { ActiveTableOfContents } from '@/components/blog/active-table-of-contents';
import type { TocItem } from '@/lib/toc';

type TableOfContentsProps = {
  items: TocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length < 2) {
    return null;
  }

  return (
    <div className="glass-card rounded-[1.75rem] p-5">
      <ActiveTableOfContents items={items} />
    </div>
  );
}
