'use client';

import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { CardLayoutPreset } from './hero-collage';
import { HeroCollage } from './hero-collage';
import { HeroVisualBackground } from './hero-visual-background';
import { MobileHeroCarousel } from './mobile-hero-carousel';

const desktopLayoutMap: Record<string, CardLayoutPreset> = {
  'software-architecture': {
    x: 94,
    y: 20,
    rotate: 3,
    zIndex: 2,
    duration: 6.4,
    delay: -1.0,
  },
  'cloud-devops': {
    x: 175,
    y: 230,
    rotate: -4,
    zIndex: 1,
    duration: 6.1,
    delay: -2.5,
  },
  'backend-engineering': {
    x: 12,
    y: 130,
    rotate: -6,
    zIndex: 3,
    duration: 5.9,
    delay: -1.5,
  },
  builder: {
    x: 246,
    y: 110,
    rotate: 5,
    zIndex: 4,
    duration: 6.8,
    delay: -3.0,
  },
  'ai-for-developers': {
    x: 30,
    y: 280,
    rotate: -8,
    zIndex: 5,
    duration: 5.3,
    delay: -0.5,
  },
};

const tabletLayoutMap: Record<string, CardLayoutPreset> = {
  // Tablet has more horizontal/vertical space, so we spread the cards further.
  // Software Architecture is center stage.
  'software-architecture': {
    x: 130,
    y: 40,
    rotate: 2,
    zIndex: 2,
    duration: 6.4,
    delay: -1.0,
  },
  // Backend Engineering pushed further left
  'backend-engineering': {
    x: -60,
    y: 120,
    rotate: -5,
    zIndex: 3,
    duration: 5.9,
    delay: -1.5,
  },
  // Builder pushed further right and up
  builder: {
    x: 320,
    y: 80,
    rotate: 4,
    zIndex: 4,
    duration: 6.8,
    delay: -3.0,
  },
  // AI pushed bottom left
  'ai-for-developers': {
    x: -20,
    y: 300,
    rotate: -6,
    zIndex: 5,
    duration: 5.3,
    delay: -0.5,
  },
  // Cloud DevOps pushed bottom right
  'cloud-devops': {
    x: 240,
    y: 280,
    rotate: -3,
    zIndex: 1,
    duration: 6.1,
    delay: -2.5,
  },
};

export function HeroVisualBoard() {
  const shouldReduceMotion = useReducedMotion();
  const boardRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || !boardRef.current) {
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

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
      className="glass-card relative flex min-h-[460px] items-center justify-center overflow-hidden rounded-[2.125rem] p-5 sm:p-6 md:min-h-[520px] md:p-7"
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
      <HeroVisualBackground shouldReduceMotion={!!shouldReduceMotion} />

      {/* Tablet Layout */}
      <HeroCollage
        className="hidden md:block lg:hidden scale-[0.85] md:scale-[0.95]"
        layoutMap={tabletLayoutMap}
        parallaxX={x}
        parallaxY={y}
        shouldReduceMotion={!!shouldReduceMotion}
      />

      {/* Desktop Layout */}
      <HeroCollage
        className="hidden lg:block lg:scale-[0.80] xl:scale-[0.96] 2xl:scale-100"
        layoutMap={desktopLayoutMap}
        parallaxX={x}
        parallaxY={y}
        shouldReduceMotion={!!shouldReduceMotion}
      />

      {/* Mobile Layout */}
      <MobileHeroCarousel shouldReduceMotion={!!shouldReduceMotion} />
    </motion.aside>
  );
}
