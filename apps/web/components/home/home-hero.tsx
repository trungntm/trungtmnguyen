'use client';

import type { Variants } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';

import { buttonVariants } from '@/components/ui/button';
import { BaseLink } from '@/components/ui/links';
import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import { HeroVisualBoard } from './hero-visual-board';

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

type HomeHeroProps = {
  dictionary: Dictionary;
};

export function HomeHero({ dictionary }: HomeHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="page-container px-4 pb-16 pt-14 md:px-6 md:pt-20" id="top">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <motion.div animate="show" className="space-y-8" initial="hidden" variants={container}>
          <motion.div
            className="inline-flex rounded-full border border-border bg-surface/80 px-4 py-2 text-xs font-medium tracking-[0.2em] text-muted uppercase shadow-sm backdrop-blur"
            variants={item}
            {...(shouldReduceMotion ? { transition: { duration: 0.01 } } : {})}
          >
            {dictionary.home.badge}
          </motion.div>
          <motion.div
            className="space-y-5"
            variants={item}
            {...(shouldReduceMotion ? { transition: { duration: 0.01 } } : {})}
          >
            <p className="text-sm font-medium tracking-[0.3em] text-muted uppercase">
              {dictionary.home.eyebrow}
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
              {dictionary.home.title} <span className="gradient-text">{dictionary.home.titleHighlight}</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted md:text-xl">
              {dictionary.home.description}
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            variants={item}
            {...(shouldReduceMotion ? { transition: { duration: 0.01 } } : {})}
          >
            <BaseLink className={buttonVariants()} href="/blog">
              {dictionary.home.blogCta}
            </BaseLink>
            <BaseLink className={cn(buttonVariants({ variant: 'secondary' }))} href="/about">
              {dictionary.home.aboutCta}
            </BaseLink>
          </motion.div>
        </motion.div>

        <HeroVisualBoard />
      </div>
    </section>
  );
}
