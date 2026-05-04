'use client';

import Image from 'next/image';
import type { MotionValue, Variants } from 'framer-motion';
import { motion, useTransform } from 'framer-motion';
import { useState } from 'react';

export type HeroVisualItem = {
  fallbackGradient: string;
  image: string;
  kind: 'technical' | 'profile';
  label: string;
  size: 'large' | 'medium' | 'small';
};

export type HeroVisualSlot = {
  delay: number;
  duration: number;
  rotate: number;
  x: number;
  y: number;
  zIndex: number;
};

type HeroImageCardProps = {
  index: number;
  item: HeroVisualItem;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  shouldReduceMotion: boolean;
  slot: HeroVisualSlot;
};

const cardSizeClasses: Record<HeroVisualItem['size'], string> = {
  large: 'h-[180px] w-[260px]',
  medium: 'h-[140px] w-[190px]',
  small: 'h-[108px] w-[140px]',
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotate: -10,
    scale: 0.9,
  },
  show: (slot: HeroVisualSlot) => ({
    opacity: 1,
    y: 0,
    rotate: slot.rotate,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function HeroImageCard({
  index,
  item,
  parallaxX,
  parallaxY,
  shouldReduceMotion,
  slot,
}: HeroImageCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const depth = shouldReduceMotion ? 0 : Math.min(10 + index * 2.5, 20);
  const x = useTransform(parallaxX, (value) => value * depth);
  const y = useTransform(parallaxY, (value) => value * depth);
  const isProfileCard = item.kind === 'profile';

  return (
    <motion.figure
      className={`absolute ${cardSizeClasses[item.size]}`}
      custom={slot}
      initial="hidden"
      style={{
        left: slot.x,
        top: slot.y,
        x,
        y,
        zIndex: slot.zIndex,
      }}
      variants={cardVariants}
    >
      <motion.div
        animate={shouldReduceMotion ? { y: 0 } : { y: [0, -12, 0] }}
        className="relative h-full w-full"
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : {
                duration: slot.duration,
                delay: slot.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-[1.6rem] border border-border/90 shadow-[0_24px_70px_-34px_var(--shadow-color)]"
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          {...(isProfileCard
            ? {
                style: {
                  filter: 'grayscale(0.35) saturate(0.9)',
                },
              }
            : {})}
          {...(!shouldReduceMotion
            ? {
                whileHover: {
                  y: -10,
                  scale: 1.05,
                  borderColor: 'var(--primary)',
                  boxShadow: '0 30px 84px -36px var(--shadow-color)',
                  ...(isProfileCard
                    ? {
                        filter: 'grayscale(0.15) saturate(1)',
                      }
                    : {}),
                },
              }
            : {})}
        >
          <div className="absolute inset-0" style={{ backgroundImage: item.fallbackGradient }} />

          {!imageFailed ? (
            <Image
              alt={item.label}
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 260px, (min-width: 1024px) 220px, 190px"
              src={item.image}
              unoptimized
              onError={() => setImageFailed(true)}
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-background/88 via-background/18 to-transparent dark:from-background/86" />

          <figcaption className="absolute inset-x-0 bottom-0 px-4 py-3 text-[0.68rem] font-semibold tracking-[0.22em] text-white/92 uppercase">
            {item.label}
          </figcaption>
        </motion.div>
      </motion.div>
    </motion.figure>
  );
}
