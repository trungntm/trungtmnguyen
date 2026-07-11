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

function createEvaluateOptions(
  format?: Parameters<typeof evaluate>[1]['format'],
): Parameters<typeof evaluate>[1] {
  return {
    ...runtime,
    ...(format ? { format } : {}),
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
  };
}

export async function MDXRenderer({ className, components, slug, source }: MDXRendererProps) {
  const file = {
    path: `${slug}.mdx`,
    value: source,
  };

  let evaluated: Awaited<ReturnType<typeof evaluate>>;

  try {
    evaluated = await evaluate(file, createEvaluateOptions());
  } catch (error) {
    const isMdxExpressionParseError =
      error instanceof Error &&
      ('source' in error || 'reason' in error) &&
      ((error as { source?: string }).source === 'micromark-extension-mdx-expression' ||
        (error as { reason?: string }).reason === 'Could not parse expression with acorn');

    if (!isMdxExpressionParseError) {
      throw error;
    }

    evaluated = await evaluate(file, createEvaluateOptions('md'));
  }

  const Content = evaluated.default;

  return (
    <div className={cn('mdx-prose', className)}>
      <Content components={{ ...mdxComponents, ...components }} />
    </div>
  );
}
