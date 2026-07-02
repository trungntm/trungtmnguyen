import { MDXRenderer } from '@/components/mdx/mdx-renderer';
import { compileCmsMarkdown } from '@/features/cms-blog/lib/compile-cms-markdown';

type CmsMarkdownRendererProps = {
  contentMd: string;
  slug: string;
};

export async function CmsMarkdownRenderer({ contentMd, slug }: CmsMarkdownRendererProps) {
  const code = await compileCmsMarkdown(contentMd, slug);

  return <MDXRenderer className="blog-prose" code={code} />;
}
