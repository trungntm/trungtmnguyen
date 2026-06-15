'use client';

import { Check, Copy } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useRef, useState } from 'react';

import { defaultLocale, getDictionary, isValidLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type CodeBlockFigureProps = ComponentPropsWithoutRef<'figure'>;

export function CodeBlockFigure({ className, children, ...props }: CodeBlockFigureProps) {
  const figureRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);
  const pathname = usePathname();
  const firstSegment = pathname?.split('/').filter(Boolean)[0];
  const locale = firstSegment && isValidLocale(firstSegment) ? firstSegment : defaultLocale;
  const dictionary = getDictionary(locale);

  useEffect(() => {
    const detectedLanguage = figureRef.current
      ?.querySelector('pre[data-language]')
      ?.getAttribute('data-language');

    setLanguage(detectedLanguage?.toLowerCase() ?? null);
  }, []);

  async function handleCopy() {
    const codeElement = figureRef.current?.querySelector('code');
    const code = codeElement?.textContent;

    if (!code) {
      return;
    }

    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <figure
      ref={figureRef}
      className={cn(
        'group/code my-8 overflow-hidden rounded-[1.5rem] border border-border bg-surface/70 shadow-[0_18px_55px_-35px_var(--shadow-color)]',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-border/80 px-3 py-2">
        <span className="px-2 text-[11px] font-semibold tracking-[0.22em] text-muted uppercase">
          {language ?? 'code'}
        </span>
        <button
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/35 hover:text-foreground"
          onClick={handleCopy}
          type="button"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span>{copied ? dictionary.common.copied : dictionary.common.copy}</span>
        </button>
      </div>
      {children}
    </figure>
  );
}
