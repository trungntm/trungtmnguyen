import type { ReactNode } from 'react';

type AboutLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  sidebar: ReactNode;
  children: ReactNode;
};

export function AboutLayout({ eyebrow, title, description, sidebar, children }: AboutLayoutProps) {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-5">
        <p className="text-sm font-medium tracking-[0.3em] text-muted uppercase">{eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">{title}</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted md:text-xl">{description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-8">
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">{sidebar}</aside>
        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </div>
  );
}
