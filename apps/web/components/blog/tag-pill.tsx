import { cn } from '@/lib/utils';

type TagPillProps = {
  tag: string;
  className?: string;
};

export function TagPill({ tag, className }: TagPillProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border border-primary/18 bg-primary/8 px-3 py-1 text-xs font-medium tracking-[0.18em] text-primary uppercase',
        className,
      )}
    >
      {tag}
    </span>
  );
}
