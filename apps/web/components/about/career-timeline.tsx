'use client';

import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { Page } from '@/lib/pages';
import { cn } from '@/lib/utils';
import { BaseLink } from '@/components/ui/links';

type CareerItem = NonNullable<Page['career']>[number];

type CareerTimelineProps = {
  eyebrow: string;
  title: string;
  items?: Page['career'];
  projectLabel: string;
  showDetailsLabel: string;
  hideDetailsLabel: string;
};

type CareerProjectItemProps = {
  item: CareerItem;
  projectLabel: string;
  showDetailsLabel: string;
  hideDetailsLabel: string;
};

function CareerProjectItem({
  item,
  projectLabel,
  showDetailsLabel,
  hideDetailsLabel,
}: CareerProjectItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const title = item.project ?? item.company;

  return (
    <article className="relative rounded-[1.5rem] border border-border/70 bg-background/55 p-5 pl-6 transition-colors hover:border-primary/30">
      <div className="absolute left-0 top-6 h-px w-4 bg-border/80" />
      <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
        {projectLabel}
      </p>
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h4 className="text-base font-semibold tracking-tight">{title}</h4>
          <p className="text-sm text-muted">{item.role}</p>
        </div>
        <span className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
          {item.duration}
        </span>
      </div>

      <button
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none"
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span>{isOpen ? hideDetailsLabel : showDetailsLabel}</span>
        <ChevronDown className={cn('size-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen ? (
        <div className="mt-4 space-y-4">
          <ul className="space-y-2">
            {item.description.map((description: string) => (
              <li key={description} className="flex gap-3 text-sm leading-7 text-muted">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                />
                <span>{description}</span>
              </li>
            ))}
          </ul>

          {item.links?.length ? (
            <div className="flex flex-wrap gap-2">
              {item.links.map((link: NonNullable<CareerItem['links']>[number]) => (
                <BaseLink
                  key={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3 py-2 text-sm font-medium text-foreground/85 hover:text-primary"
                  href={link.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>{link.text}</span>
                  <ArrowUpRight className="size-3.5" />
                </BaseLink>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function CareerTimeline({
  eyebrow,
  title,
  items,
  projectLabel,
  showDetailsLabel,
  hideDetailsLabel,
}: CareerTimelineProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="glass-card rounded-[2rem] p-6 md:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">{eyebrow}</p>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        </div>

        <div className="space-y-6">
          {items.map((item) => (
            <article
              key={`${item.company}-${item.duration}`}
              className="relative rounded-[1.75rem] border border-border/70 bg-surface/70 p-6 pl-8"
            >
              <div className="absolute left-4 top-7 h-[calc(100%-3.5rem)] w-px bg-border/80" />
              <div className="absolute left-[0.72rem] top-6 size-3 rounded-full border-2 border-background bg-primary" />

              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                    {item.duration}
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight">{item.company}</h3>
                  <p className="text-sm text-muted">{item.role}</p>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {item.description.map((description: string) => (
                  <li key={description} className="flex gap-3 text-sm leading-7 text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <span>{description}</span>
                  </li>
                ))}
              </ul>

              {item.projects?.length ? (
                <div className="mt-6 space-y-4 border-l border-border/70 pl-5">
                  {item.projects.map((project: CareerItem) => (
                    <CareerProjectItem
                      key={`${project.project ?? project.company}-${project.duration}`}
                      hideDetailsLabel={hideDetailsLabel}
                      item={project}
                      projectLabel={projectLabel}
                      showDetailsLabel={showDetailsLabel}
                    />
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
