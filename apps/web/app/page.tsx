import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  path: '/',
});

export default function HomePage() {
  return (
    <section className="page-container px-4 pb-16 pt-14 md:px-6 md:pt-20">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-border bg-surface/80 px-4 py-2 text-xs font-medium tracking-[0.2em] text-muted uppercase shadow-sm backdrop-blur">
            Technical Blog Platform
          </div>
          <div className="space-y-5">
            <p className="text-sm font-medium tracking-[0.3em] text-muted uppercase">
              Engineering notes, systems thinking, practical delivery
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
              A clean technical blog foundation for shipping ideas with{' '}
              <span className="gradient-text">clarity and rigor.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted md:text-xl">
              This workspace is prepared for future writing about software architecture, Java,
              Spring Boot, Next.js, DevOps, and modern engineering practice.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className={buttonVariants()} href="/blog">
              Explore Blog
            </Link>
            <Link className={cn(buttonVariants({ variant: 'secondary' }))} href="/about">
              Read About
            </Link>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden rounded-[2rem] p-8 md:p-10">
          <div className="gradient-bg absolute inset-x-0 top-0 h-1" />
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium tracking-[0.25em] text-muted uppercase">
                Current focus
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Platform and writing infrastructure</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                'Monorepo + Turborepo',
                'SEO and metadata baseline',
                'Theme-aware design system',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-[1.5rem] border border-border bg-background/70 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Ready for next phases</span>
                <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_20px_var(--color-accent)]" />
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">
                Content modeling, MDX rendering, search, RSS, and publishing workflows can layer on
                top of this baseline without reshaping the app shell.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
