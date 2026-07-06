import { evaluate } from '@mdx-js/mdx';
import type { ElementType } from 'react';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import * as runtime from 'react/jsx-runtime';

import { cn } from '@/lib/utils';

import { mdxComponents } from './mdx-components';

type MDXComponents = Record<string, ElementType>;

type MDXRendererProps = {
  className?: string;
  components?: MDXComponents;
  slug: string;
  source: string;
};

export async function MDXRenderer({ className, components, slug, source }: MDXRendererProps) {
  const evaluated = await evaluate(
    {
      path: `${slug}.mdx`,
      value: source,
    },
    {
      ...runtime,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['heading-anchor'],
            },
          },
        ],
        [
          rehypePrettyCode,
          {
            keepBackground: false,
            theme: {
              light: 'github-light-default',
              dark: 'github-dark-default',
            },
          },
        ],
      ],
    },
  );

  const Content = evaluated.default;

  return (
    <div className={cn('mdx-prose', className)}>
      <Content components={{ ...mdxComponents, ...components }} />
    </div>
  );
}
