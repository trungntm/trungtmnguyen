import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { TagPill } from '@/components/blog/tag-pill';
import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import type { Blog } from '@/lib/blogs';
import { formatBlogDate, getAllBlogSlugs, getBlogBySlug } from '@/lib/blogs';
import { createMetadata, siteConfig } from '@/lib/seo';
import { resolvePublicAsset } from '@/lib/public-assets';

type BlogDetailPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

async function getResolvedBlog(slugSegments: string[]) {
  const { isEnabled } = await draftMode();
  return getBlogBySlug(slugSegments, { includeDrafts: isEnabled }) as Blog | null;
}

function resolveBlogImages(blog: Blog) {
  return [blog.cover, blog.thumbnail]
    .filter((image): image is string => Boolean(image))
    .map((image) => new URL(image, siteConfig.siteUrl).toString());
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getResolvedBlog(slug);

  if (!blog) {
    return createMetadata({
      title: 'Tech Blogs',
      path: '/blog',
    });
  }

  const images = resolveBlogImages(blog);

  return {
    title: blog.title,
    description: blog.description,
    alternates: {
      canonical: blog.url,
    },
    openGraph: {
      type: 'article',
      url: blog.url,
      title: blog.title,
      description: blog.description,
      siteName: siteConfig.name,
      publishedTime: new Date(blog.publishedAt).toISOString(),
      modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
      authors: [blog.author],
      tags: blog.tags,
      images,
    },
    twitter: {
      card: images.length > 0 ? 'summary_large_image' : 'summary',
      title: blog.title,
      description: blog.description,
      images,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getResolvedBlog(slug);

  if (!blog) {
    notFound();
  }

  const cover = resolvePublicAsset(blog.cover);

  return (
    <article className="page-container px-4 py-14 md:px-6 md:py-18">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="space-y-6">
          <p className="text-sm font-medium tracking-[0.3em] text-muted uppercase">Article</p>

          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              {blog.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted md:text-xl">{blog.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span>{formatBlogDate(blog.publishedAt)}</span>
            <span>{blog.author}</span>
            <span>{blog.readingTime.text}</span>
            {blog.updatedAt ? <span>Updated {formatBlogDate(blog.updatedAt)}</span> : null}
          </div>

          {cover ? (
            <div className="glass-card relative aspect-[16/9] overflow-hidden rounded-[2rem]">
              <Image
                alt={blog.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                src={cover}
              />
            </div>
          ) : null}
        </header>

        <div className="glass-card rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <MDXRenderer className="blog-prose" code={blog.mdx} />
        </div>
      </div>
    </article>
  );
}
