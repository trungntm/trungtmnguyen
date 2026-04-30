import type { Route } from 'next';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links: Array<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4 md:px-6">
      <div className="page-container glass-card flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link className="flex items-center gap-3" href="/">
          <span className="gradient-bg flex size-10 items-center justify-center rounded-2xl text-sm font-bold text-white">
            TN
          </span>
          <div>
            <div className="text-sm font-semibold tracking-[0.18em] text-muted uppercase">
              Trung Nguyen
            </div>
            <div className="text-xs text-muted">Software Engineering Blog</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-foreground',
                link.href === '/blog' && 'hover:text-primary',
              )}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className={cn(buttonVariants({ variant: 'secondary' }), 'hidden md:inline-flex')}
            href="/blog"
          >
            Explore Notes
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
