'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { HoverUnderlineLink } from '@/components/ui/hover-underline-link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links: Array<{ href: Route; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
];

export function SiteHeader() {
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const pinOffset = 12;
    const unpinOffset = 4;

    const handleScroll = () => {
      const nextScrollY = window.scrollY;

      setIsPinned((currentValue) => {
        if (currentValue) {
          return nextScrollY > unpinOffset;
        }

        return nextScrollY > pinOffset;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'sticky z-40 px-4 transition-[padding] duration-300 md:px-6',
        isPinned ? 'top-0 pt-3' : 'top-0 pt-4',
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-background/28 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)]" />
      <div
        className={cn(
          'page-container glass-card flex items-center justify-between gap-4 rounded-[1.75rem] px-4 py-3 md:px-6',
        )}
      >
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
            <HoverUnderlineLink
              key={link.href}
              className={cn('text-muted', link.href === '/blog' && 'hover:text-primary')}
              href={link.href}
            >
              {link.label}
            </HoverUnderlineLink>
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
