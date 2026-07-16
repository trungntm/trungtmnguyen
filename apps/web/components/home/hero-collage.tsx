'use client';

import type { MotionValue, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { HeroImageCard } from './hero-image-card';
import { heroVisualItems } from './hero-visual-data';

export type CardLayoutPreset = {
  delay: number;
  duration: number;
  rotate: number;
  x: number;
  y: number;
  zIndex: number;
};

type HeroCollageProps = {
  className?: string;
  layoutMap: Record<string, CardLayoutPreset>;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  shouldReduceMotion: boolean;
};

const stackVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotate: -10,
    scale: 0.9,
  },
  show: (layout: CardLayoutPreset) => ({
    opacity: 1,
    y: 0,
    rotate: layout.rotate,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function HeroCollage({
  className = '',
  layoutMap,
  parallaxX,
  parallaxY,
  shouldReduceMotion,
}: HeroCollageProps) {
  return (
    <motion.div
      animate="show"
      className={`absolute left-1/2 top-4 h-[440px] w-[448px] origin-top -translate-x-1/2 ${className}`}
      initial="hidden"
      variants={stackVariants}
    >
      {heroVisualItems.map((item, index) => {
        const layout = layoutMap[item.id] || layoutMap['software-architecture'];

        if (!layout) {
          return null;
        }

        return (
          <motion.div
            key={item.id}
            custom={layout}
            variants={cardVariants}
            className="absolute"
            style={{
              left: layout.x,
              top: layout.y,
              zIndex: layout.zIndex,
            }}
          >
            <HeroImageCard
              depthIndex={index}
              floatingAnimation={{ delay: layout.delay, duration: layout.duration }}
              item={item}
              parallaxX={parallaxX}
              parallaxY={parallaxY}
              shouldReduceMotion={shouldReduceMotion}
              variant="desktop"
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
