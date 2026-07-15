'use client';

import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { HeroImageCard, type HeroVisualItem, type HeroVisualSlot } from './hero-image-card';

const heroVisualItems: HeroVisualItem[] = [
  {
    label: 'Software Architecture',
    image: '/images/hero/software-architect.png',
    fallbackGradient: 'linear-gradient(135deg, #1e293b, #2563eb 48%, #22d3ee)',
    size: 'large',
    kind: 'technical',
  },
  {
    label: 'Backend Engineering',
    image: '/images/hero/backend-engineering.png',
    fallbackGradient: 'linear-gradient(135deg, #111827, #7c3aed 52%, #60a5fa)',
    size: 'medium',
    kind: 'technical',
  },
  {
    label: 'Cloud & DevOps',
    image: '/images/hero/cloud-devops.png',
    fallbackGradient: 'linear-gradient(135deg, #020617, #334155 42%, #a78bfa)',
    size: 'large',
    kind: 'technical',
  },
  {
    label: 'AI for Developers',
    image: '/images/hero/AI-for-developers.png',
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

type LayoutPreset = {
  large: HeroVisualSlot[];
  medium: HeroVisualSlot[];
  small: HeroVisualSlot[];
};

const layoutPresets: LayoutPreset[] = [
  // Preset 1: Classic spread
  {
    large: [
      { x: 170, y: 20, rotate: 5, zIndex: 2, duration: 6.4, delay: -2.3 },
      { x: 12, y: 240, rotate: 8, zIndex: 1, duration: 6.8, delay: -1.8 },
    ],
    medium: [
      { x: 12, y: 14, rotate: -7, zIndex: 3, duration: 5.6, delay: -1 },
      { x: 245, y: 285, rotate: -6, zIndex: 4, duration: 7, delay: -3.1 },
    ],
    small: [
      { x: 150, y: 160, rotate: 3, zIndex: 5, duration: 5.2, delay: -0.6 },
    ],
  },
  // Preset 2: Alternate spread
  {
    large: [
      { x: 15, y: 20, rotate: -6, zIndex: 2, duration: 6.2, delay: -2.0 },
      { x: 175, y: 240, rotate: 4, zIndex: 1, duration: 6.5, delay: -1.5 },
    ],
    medium: [
      { x: 245, y: 15, rotate: 7, zIndex: 3, duration: 5.8, delay: -1.2 },
      { x: 15, y: 285, rotate: -5, zIndex: 4, duration: 7.2, delay: -3.5 },
    ],
    small: [
      { x: 160, y: 170, rotate: -3, zIndex: 5, duration: 5.5, delay: -0.8 },
    ],
  },
  // Preset 3: Centered emphasis
  {
    large: [
      { x: 94, y: 20, rotate: 3, zIndex: 1, duration: 6.4, delay: -1.0 },
      { x: 94, y: 240, rotate: -4, zIndex: 2, duration: 6.1, delay: -2.5 },
    ],
    medium: [
      { x: 12, y: 130, rotate: -6, zIndex: 3, duration: 5.9, delay: -1.5 },
      { x: 246, y: 110, rotate: 5, zIndex: 4, duration: 6.8, delay: -3.0 },
    ],
    small: [
      { x: 290, y: 280, rotate: -8, zIndex: 5, duration: 5.3, delay: -0.5 },
    ],
  },
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

type MappedItem = {
  item: HeroVisualItem;
  slot: HeroVisualSlot;
};

function mapItemsToLayout(items: HeroVisualItem[], layout: LayoutPreset): MappedItem[] {
  const availableSlots = {
    large: [...layout.large],
    medium: [...layout.medium],
    small: [...layout.small],
  };

  return items.map((item) => {
    const slot = availableSlots[item.size]!.shift()!;
    return { item, slot };
  });
}

export function HeroVisualBoard() {
  const shouldReduceMotion = useReducedMotion();
  const [mappedItems, setMappedItems] = useState<MappedItem[]>(() => 
    mapItemsToLayout(heroVisualItems, layoutPresets[0]!)
  );
  const boardRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    // Keep the first render deterministic, then shuffle the content mapping on mount.
    const timeoutId = window.setTimeout(() => {
      const shuffledItems = shuffleItems(heroVisualItems);
      const randomLayout = layoutPresets[Math.floor(Math.random() * layoutPresets.length)]!;
      setMappedItems(mapItemsToLayout(shuffledItems, randomLayout));
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
        {mappedItems.map(({ item, slot }, index) => (
          <HeroImageCard
            key={`${item.label}-${index}`}
            index={index}
            item={item}
            parallaxX={x}
            parallaxY={y}
            shouldReduceMotion={!!shouldReduceMotion}
            slot={slot}
          />
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/94 via-background/58 to-transparent dark:from-background/96" />
    </motion.aside>
  );
}
