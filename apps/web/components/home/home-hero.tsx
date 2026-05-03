import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { FocusPanel } from './focus-panel';

export function HomeHero() {
  return (
    <section className="page-container px-4 pb-16 pt-14 md:px-6 md:pt-20" id="top">
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

        <FocusPanel />
      </div>
    </section>
  );
}
