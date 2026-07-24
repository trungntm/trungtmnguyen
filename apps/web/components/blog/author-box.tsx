import { ArrowRight } from 'lucide-react';
import type { Route } from 'next';

import { BaseLink } from '@/components/ui/links';
import { OptimizedImage } from '@/components/ui/optimized-image';
import type { Dictionary, Locale } from '@/lib/i18n';
import { siteConfig } from '@/lib/seo';

type AuthorBoxProps = {
  locale: Locale;
  messages: Dictionary['authorBox'];
};

export function AuthorBox({ locale, messages }: AuthorBoxProps) {
  return (
    <div className="glass-card flex flex-col gap-6 rounded-3xl p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 sm:h-24 sm:w-24">
        <OptimizedImage
          alt={siteConfig.name}
          className="object-cover"
          fill
          sizes="(min-width: 640px) 96px, 80px"
          src={siteConfig.avatarImage}
        />
      </div>
      <div className="flex flex-col items-start gap-4 sm:gap-3">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold text-foreground">{siteConfig.name}</h3>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            {messages.bio}
          </p>
        </div>
        <BaseLink
          className="group flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          href={`/${locale}/about` as Route}
        >
          {messages.moreAbout}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </BaseLink>
      </div>
    </div>
  );
}
