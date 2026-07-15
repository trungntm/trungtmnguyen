'use client';

import { motion } from 'framer-motion';

type HeroVisualBackgroundProps = {
  shouldReduceMotion: boolean;
};

export function HeroVisualBackground({ shouldReduceMotion }: HeroVisualBackgroundProps) {
  return (
    <>
      <div className="gradient-bg absolute inset-x-0 top-0 h-1 opacity-95" />

      <motion.span
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : { x: [0, 20, -10], y: [0, 10, -15], scale: [1, 1.1, 0.95] }
        }
        className="pointer-events-none absolute -left-10 top-8 h-32 w-32 rounded-full bg-primary/22 blur-3xl"
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : { duration: 10, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <motion.span
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : { x: [0, -16, 12], y: [0, -12, 8], scale: [1, 1.08, 0.98] }
        }
        className="pointer-events-none absolute right-4 top-16 h-36 w-36 rounded-full bg-secondary/18 blur-3xl"
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : { duration: 11.5, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <motion.span
        aria-hidden="true"
        animate={
          shouldReduceMotion
            ? { x: 0, y: 0, scale: 1 }
            : { x: [0, 18, -8], y: [0, -10, 14], scale: [1, 1.06, 0.94] }
        }
        className="pointer-events-none absolute -left-4 bottom-20 h-32 w-32 rounded-full bg-accent/18 blur-3xl"
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : { duration: 9.8, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-background/94 via-background/58 to-transparent dark:from-background/96" />
    </>
  );
}
