'use client';

import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { HeroImageCard, type HeroVisualItem, type HeroVisualSlot } from './hero-image-card';

const heroVisualItems: HeroVisualItem[] = [
  {
    label: 'Architecture Notes',
    image: 'https://placehold.co/260x180?text=Architecture&font=roboto',
    fallbackGradient: 'linear-gradient(135deg, #1e293b, #2563eb 48%, #22d3ee)',
    size: 'large',
    kind: 'technical',
  },
  {
    label: 'Next.js Patterns',
    image: 'https://placehold.co/260x180?text=Next.js&font=roboto',
    fallbackGradient: 'linear-gradient(135deg, #111827, #7c3aed 52%, #60a5fa)',
    size: 'medium',
    kind: 'technical',
  },
  {
    label: 'DevOps Runtime',
    image: 'https://placehold.co/260x180?text=DevOps&font=roboto',
    fallbackGradient: 'linear-gradient(135deg, #020617, #334155 42%, #a78bfa)',
    size: 'large',
    kind: 'technical',
  },
  {
    label: 'Systems',
    image: 'https://placehold.co/260x180?text=Systems&font=roboto',
    fallbackGradient: 'linear-gradient(135deg, #0f172a, #0891b2 52%, #22d3ee)',
    size: 'small',
    kind: 'technical',
  },
  {
    label: 'Builder',
    image: '/images/hero/builder-profile.png',
    fallbackGradient: 'linear-gradient(135deg, #020617, #4f46e5 48%, #06b6d4)',
    size: 'medium',
    kind: 'profile',
  },
];

const heroVisualSlots: HeroVisualSlot[] = [
  { x: 18, y: 16, rotate: -7, zIndex: 3, duration: 5.6, delay: -1 },
  { x: 210, y: 42, rotate: 5, zIndex: 4, duration: 6.4, delay: -2.3 },
  { x: 92, y: 184, rotate: 3, zIndex: 5, duration: 5.2, delay: -0.6 },
  { x: 300, y: 210, rotate: -6, zIndex: 2, duration: 7, delay: -3.1 },
  { x: -8, y: 272, rotate: 8, zIndex: 1, duration: 6.8, delay: -1.8 },
];

const stackVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function shuffleItems(items: HeroVisualItem[]) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = nextItems[index]!;
    const swappedItem = nextItems[randomIndex]!;
    nextItems[index] = swappedItem;
    nextItems[randomIndex] = currentItem;
  }

  return nextItems;
}

export function HeroVisualBoard() {
  const shouldReduceMotion = useReducedMotion();
  const [items, setItems] = useState(heroVisualItems);
  const boardRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    // Keep the first render deterministic, then shuffle the content mapping on mount.
    const timeoutId = window.setTimeout(() => {
      setItems(shuffleItems(heroVisualItems));
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || !boardRef.current) {
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    // Motion values keep the parallax smooth without causing React re-renders.
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.aside
      ref={boardRef}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="glass-card relative min-h-[460px] overflow-hidden rounded-[2.125rem] p-5 sm:p-6 md:min-h-[520px] md:p-7"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      transition={
        shouldReduceMotion
          ? { duration: 0.01 }
          : {
              duration: 0.8,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
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

      <motion.div
        animate="show"
        className="absolute left-1/2 top-4 h-[440px] w-[448px] origin-top -translate-x-1/2 scale-[0.72] sm:scale-[0.84] md:scale-[0.92] lg:scale-[0.76] xl:scale-[0.94] 2xl:scale-100"
        initial="hidden"
        variants={stackVariants}
      >
        {items.map((item, index) => (
          <HeroImageCard
            key={`${item.label}-${index}`}
            index={index}
            item={item}
            parallaxX={x}
            parallaxY={y}
            shouldReduceMotion={!!shouldReduceMotion}
            slot={heroVisualSlots[index]!}
          />
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/94 via-background/58 to-transparent dark:from-background/96" />
      <div className="relative flex min-h-[420px] items-end md:min-h-[470px]">
        <div className="space-y-2">
          <h2 className="max-w-sm text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Randomized covers for notes, systems, and engineering ideas
          </h2>
        </div>
      </div>
    </motion.aside>
  );
}
