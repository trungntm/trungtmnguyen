'use client';

import type { Variants } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
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

export function HomeHero() {
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
            Technical Blog Platform
          </motion.div>
          <motion.div
            className="space-y-5"
            variants={item}
            {...(shouldReduceMotion ? { transition: { duration: 0.01 } } : {})}
          >
            <p className="text-sm font-medium tracking-[0.3em] text-muted uppercase">
              Engineering notes, systems thinking, practical delivery
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
              A clean technical blog foundation for shipping ideas with{' '}
              <span className="gradient-text">clarity and rigor.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted md:text-xl">
              This workspace is prepared for future writing about software architecture, Java,
              Spring Boot, Next.js, DevOps, and modern engineering practice.
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col gap-3 sm:flex-row"
            variants={item}
            {...(shouldReduceMotion ? { transition: { duration: 0.01 } } : {})}
          >
            <Link className={buttonVariants()} href="/blog">
              Explore Blog
            </Link>
            <Link className={cn(buttonVariants({ variant: 'secondary' }))} href="/about">
              Read About
            </Link>
          </motion.div>
        </motion.div>

        <HeroVisualBoard />
      </div>
    </section>
  );
}
