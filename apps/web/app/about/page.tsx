import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'About',
  path: '/about',
});

export default function AboutPage() {
  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm font-medium tracking-[0.3em] text-muted uppercase">About</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          A focused space for engineering decisions, tradeoffs, and delivery notes.
        </h1>
        <div className="glass-card space-y-4 rounded-[2rem] p-8 text-base leading-8 text-muted">
          <p>
            This page is intentionally lightweight for Phase 1. The layout, palette, typography,
            spacing system, and theme behavior are already in place, but profile content and
            narrative details come later.
          </p>
          <p>
            The foundation is optimized for technical writing, architecture sketches, and long-form
            implementation notes without coupling the shell to a future content pipeline.
          </p>
        </div>
      </div>
    </section>
  );
}
