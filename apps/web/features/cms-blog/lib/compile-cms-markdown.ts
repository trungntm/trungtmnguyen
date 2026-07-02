import 'server-only';

import type { Meta } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

type RuntimeMdxDocument = {
  _meta: Meta;
  content: string;
};

const runtimeMdxContext = {
  cache: async <TInput, TOutput>(
    input: TInput,
    compute: (value: TInput) => Promise<TOutput> | TOutput,
  ) => compute(input),
};

function createRuntimeMeta(key: string): Meta {
  return {
    filePath: key,
    fileName: `${key}.mdx`,
    directory: 'cms-blog',
    path: key,
    extension: 'mdx',
  };
}

export async function compileCmsMarkdown(contentMd: string, key: string) {
  const document: RuntimeMdxDocument = {
    _meta: createRuntimeMeta(key),
    content: contentMd,
  };

  return compileMDX(runtimeMdxContext, document, {
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
  });
}
