'use client';

import type { Route } from 'next';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { useEffect, useState } from 'react';

import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { useBlogTranslations } from '@/components/layout/blog-translations-context';
import { SearchButton } from '@/components/search/search-button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { HoverUnderlineLink } from '@/components/ui/hover-underline-link';
import { buttonVariants } from '@/components/ui/button';
import { BaseLink } from '@/components/ui/links';
import type { Dictionary, Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/seo';

const headerAvatarSrc = siteConfig.avatarImage;

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const [isPinned, setIsPinned] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const { translations } = useBlogTranslations();
  const links: Array<{ href: Route; label: string }> = [
    { href: '/' as Route, label: dictionary.navigation.home },
    { href: '/about' as Route, label: dictionary.navigation.about },
    { href: '/blog' as Route, label: dictionary.navigation.blog },
    { href: '/series' as Route, label: dictionary.navigation.series },
  ];

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
        <BaseLink className="flex items-center gap-3" href="/">
          <span className="gradient-bg relative flex size-10 items-center justify-center overflow-hidden rounded-2xl text-sm font-bold text-white">
            {avatarFailed ? (
              'TN'
            ) : (
              <OptimizedImage
                alt="Trung Nguyen"
                className="object-cover"
                fill
                sizes="40px"
                src={headerAvatarSrc}
                onError={() => setAvatarFailed(true)}
              />
            )}
          </span>
          <div>
            <div className="text-sm font-semibold tracking-[0.18em] text-muted uppercase">
              Trung Nguyen
            </div>
            <div className="text-xs text-muted">{dictionary.navigation.siteTagline}</div>
          </div>
        </BaseLink>

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
          <BaseLink
            className={cn(buttonVariants({ variant: 'secondary' }), 'hidden md:inline-flex')}
            href="/blog"
          >
            {dictionary.navigation.exploreNotes}
          </BaseLink>
          <SearchButton label={dictionary.common.search} openLabel={dictionary.common.openSearch} />
          <LanguageSwitcher
            locale={locale}
            {...(translations ? { postTranslations: translations } : {})}
          />
          <ThemeToggle label={dictionary.common.toggleTheme} />
        </div>
      </div>
    </header>
  );
}
