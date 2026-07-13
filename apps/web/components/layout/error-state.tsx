'use client';

type ErrorStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
  retryLabel: string;
  onRetry: () => void;
};

export function ErrorState({
  eyebrow,
  title,
  description,
  primaryActionLabel,
  primaryActionHref,
  secondaryActionLabel,
  secondaryActionHref,
  retryLabel,
  onRetry,
}: ErrorStateProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 md:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="gradient-orb-left" />
        <div className="gradient-orb-right" />
        <div className="grid-overlay" />
      </div>

      <section className="page-container w-full max-w-4xl">
        <div className="glass-card relative overflow-hidden rounded-[2rem] border border-border/70 p-6 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)] md:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
            <div className="space-y-5">
              <p className="text-[11px] font-semibold tracking-[0.28em] text-muted uppercase">
                {eyebrow}
              </p>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted md:text-lg">{description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-[0_12px_32px_-18px_var(--color-primary)] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                type="button"
                onClick={onRetry}
              >
                {retryLabel}
              </button>

              <a
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-surface/80 px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                href={primaryActionHref}
              >
                {primaryActionLabel}
              </a>

              <a
                className="inline-flex h-11 items-center justify-center rounded-full bg-transparent px-5 text-sm font-semibold text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                href={secondaryActionHref}
              >
                {secondaryActionLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
