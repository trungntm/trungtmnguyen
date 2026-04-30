import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Blog',
  path: '/blog',
});

export default function BlogPage() {
  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-medium tracking-[0.3em] text-muted uppercase">Blog</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Content is not implemented yet. The publishing surface is.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            This route proves the final shell, spacing, metadata, and theme system. Article
            collections, categories, MDX, and indexing will arrive in later phases.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            'Routing and layout baseline',
            'SEO-ready route metadata',
            'Responsive page scaffolding',
          ].map((item, index) => (
            <article
              key={item}
              className="glass-card rounded-[1.75rem] p-6"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <p className="text-sm font-medium tracking-[0.25em] text-muted uppercase">
                Placeholder {index + 1}
              </p>
              <h2 className="mt-4 text-xl font-semibold">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Stable infrastructure is in place so content systems can plug in without reworking
                the presentation layer.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
