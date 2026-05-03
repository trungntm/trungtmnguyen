import { MDXContent } from '@content-collections/mdx/react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

import { mdxComponents } from './mdx-components';

type MDXRendererProps = {
  className?: string;
  code: ComponentProps<typeof MDXContent>['code'];
  components?: ComponentProps<typeof MDXContent>['components'];
};

export function MDXRenderer({ className, code, components }: MDXRendererProps) {
  return (
    <div className={cn('mdx-prose', className)}>
      <MDXContent code={code} components={{ ...mdxComponents, ...components }} />
    </div>
  );
}
