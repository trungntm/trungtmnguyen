/* eslint-disable @next/next/no-img-element */
import type { ComponentProps, ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

import { BaseLink } from '@/components/ui/links';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { CodeBlockFigure } from './code-block-figure';

type AnchorProps = ComponentProps<typeof BaseLink>;
type CodeProps = ComponentPropsWithoutRef<'code'>;
type ImgProps = ComponentPropsWithoutRef<'img'>;

export const mdxComponents = {
  h1: ({ className, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className={cn(
        'mt-14 scroll-mt-28 text-4xl font-bold tracking-tight text-foreground',
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className={cn(
        'mt-12 scroll-mt-28 text-3xl font-semibold tracking-tight text-foreground',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className={cn(
        'mt-10 scroll-mt-28 text-2xl font-semibold tracking-tight text-foreground',
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
    <p className={cn('text-base leading-8 text-foreground/90', className)} {...props} />
  ),
  a: ({ className, ...props }: AnchorProps) => (
    <BaseLink
      className={cn(
        'transition-colors hover:text-primary',
        !className?.includes('heading-anchor') &&
          'underline decoration-primary/35 underline-offset-4',
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul className={cn('list-disc space-y-3 pl-6 text-foreground/90', className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<'ol'>) => (
    <ol className={cn('list-decimal space-y-3 pl-6 text-foreground/90', className)} {...props} />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<'li'>) => (
    <li className={cn('pl-1 leading-8', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className={cn(
        'rounded-r-2xl border-l-4 border-primary/35 bg-primary/6 px-5 py-4 text-foreground/85 italic',
        className,
      )}
      {...props}
    />
  ),
  figure: ({ className, ...props }: ComponentPropsWithoutRef<'figure'>) => {
    const isPrettyCodeFigure =
      'data-rehype-pretty-code-figure' in props && props['data-rehype-pretty-code-figure'] === '';

    if (isPrettyCodeFigure) {
      return <CodeBlockFigure className={className} {...props} />;
    }

    return <figure className={cn('mx-auto', className)} {...props} />;
  },
  code: ({ className, ...props }: CodeProps) => {
    const isBlockCode =
      className?.includes('language-') ||
      className?.includes('rehype-code-title') ||
      'data-language' in props;

    if (isBlockCode) {
      return <code className={className} {...props} />;
    }

    return (
      <code
        className={cn(
          'rounded-md bg-foreground/6 px-1.5 py-1 font-mono text-[0.95em] text-primary',
          className,
        )}
        {...props}
      />
    );
  },
  pre: ({ className, ...props }: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className={cn(
        'overflow-x-auto px-0 py-5 text-sm',
        !('data-language' in props) &&
          'rounded-[1.5rem] border border-border bg-surface/70 p-5 shadow-[0_18px_55px_-35px_var(--shadow-color)]',
        className,
      )}
      {...props}
    />
  ),
  img: ({ className, alt, src, width, height, ...props }: ImgProps) => {
    if (!src) return null;
    
    // For markdown images without explicit width/height, we can use responsive fill, 
    // but Next.js requires width/height if we aren't using fill.
    // If we have width and height from rehype, we pass them.
    // Otherwise we'll render it as fill with an aspect-ratio wrapper, 
    // or just fallback to native img if it's too complex to guess. 
    // Since rehype plugins (like rehype-img-size) usually provide width/height:
    
    const parsedWidth = width ? parseInt(String(width), 10) : undefined;
    const parsedHeight = height ? parseInt(String(height), 10) : undefined;
    
    if (parsedWidth && parsedHeight) {
      return (
        <OptimizedImage
          alt={alt ?? ''}
          className={cn(
            'block mx-auto rounded-[1.5rem] border border-border/70 shadow-[0_18px_55px_-38px_var(--shadow-color)]',
            className,
          )}
          src={src as string}
          width={parsedWidth}
          height={parsedHeight}
          sizes="(min-width: 1024px) 768px, 100vw"
        />
      );
    }
    
    return (
      <img
        alt={alt ?? ''}
        className={cn(
          'block mx-auto rounded-[1.5rem] border border-border/70 shadow-[0_18px_55px_-38px_var(--shadow-color)]',
          className,
        )}
        loading="lazy"
        src={src}
        {...props}
      />
    );
  },
  table: ({ className, ...props }: ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto">
      <table className={cn('w-full border-collapse text-left text-sm', className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<'th'>) => (
    <th
      className={cn('border-b border-border px-4 py-3 font-semibold text-foreground', className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<'td'>) => (
    <td
      className={cn('border-b border-border/70 px-4 py-3 text-foreground/85', className)}
      {...props}
    />
  ),
};
