import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogCard } from '@/components/blog/blog-card';
import {
  getAllTags,
  getBlogsByTag,
  getTagLabelFromSlug,
  normalizeTag,
} from '@/lib/blogs';
import { siteConfig } from '@/lib/seo';

type TagDetailPageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({
    tag: tag.slug,
  }));
}

export async function generateMetadata({ params }: TagDetailPageProps): Promise<Metadata> {
  const { tag } = await params;
  const tagSlug = normalizeTag(tag);
  const tagLabel = getTagLabelFromSlug(tagSlug);

  if (!tagLabel) {
    return {};
  }

  const blogCount = getBlogsByTag(tagSlug).length;
  const description = `${blogCount} notes about ${tagLabel}`;
  const canonicalUrl = `${siteConfig.url}/tags/${tagSlug}`;

  return {
    title: `#${tagLabel}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `#${tagLabel}`,
      description,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: siteConfig.twitter.card,
      title: `#${tagLabel}`,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { tag } = await params;
  const tagSlug = normalizeTag(tag);
  const tagLabel = getTagLabelFromSlug(tagSlug);

  if (!tagLabel) {
    notFound();
  }

  const blogs = getBlogsByTag(tagSlug);

  return (
    <section className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="space-y-10">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">#{tagLabel}</h1>
          <p className="max-w-3xl text-lg leading-8 text-muted">
            {blogs.length} {blogs.length === 1 ? 'note' : 'notes'} about {tagLabel}
          </p>
        </div>

        {blogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <p className="text-sm font-medium tracking-[0.25em] text-muted uppercase">
              No published posts
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              This tag exists, but there are no visible posts attached to it.
            </h2>
          </div>
        )}
      </div>
    </section>
  );
}
