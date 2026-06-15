'use client';

import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';

const emptySubscribe = () => () => undefined;

type ThemeToggleProps = {
  label: string;
};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle({ label }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button
        aria-label={label}
        className="rounded-full border border-border bg-background/60 text-muted"
        disabled
        size="icon"
        variant="ghost"
      >
        <span aria-hidden="true" className="size-4 rounded-full border border-border/80" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      aria-label={label}
      className="cursor-pointer rounded-full border border-border bg-background/60 text-muted hover:border-primary/45 hover:bg-background/80 hover:text-foreground"
      size="icon"
      variant="ghost"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <SunMedium className="size-4" /> : <MoonStar className="size-4" />}
    </Button>
  );
}
