'use client';

import Image from 'next/image';
import type { MotionValue } from 'framer-motion';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { useState } from 'react';
import type { HeroVisualItem } from './hero-visual-data';

export type HeroImageCardProps = {
  className?: string;
  depthIndex?: number;
  floatingAnimation?: {
    delay: number;
    duration: number;
  };
  item: HeroVisualItem;
  parallaxX?: MotionValue<number>;
  parallaxY?: MotionValue<number>;
  shouldReduceMotion: boolean;
  style?: import('framer-motion').MotionStyle;
  variant?: 'desktop' | 'mobile';
};

const cardSizeClasses: Record<HeroVisualItem['size'], string> = {
  large: 'h-[180px] w-[260px]',
  medium: 'h-[140px] w-[190px]',
  small: 'h-[108px] w-[140px]',
};

export function HeroImageCard({
  className = '',
  depthIndex = 0,
  floatingAnimation,
  item,
  parallaxX,
  parallaxY,
  shouldReduceMotion,
  style,
  variant = 'desktop',
}: HeroImageCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  
  // Depth calculation for parallax effect
  const depth = shouldReduceMotion ? 0 : Math.min(10 + depthIndex * 2.5, 20);
  
  // We need fallback motion values if parallax isn't provided (e.g. on mobile)
  const defaultMotionValue = useMotionValue(0);
  const x = useTransform(parallaxX || defaultMotionValue, (value: number) => value * depth);
  const y = useTransform(parallaxY || defaultMotionValue, (value: number) => value * depth);
  
  const isProfileCard = item.kind === 'profile';
  const sizeClass = variant === 'desktop' ? cardSizeClasses[item.size] : 'w-full h-full';

  return (
    <motion.figure
      className={`${sizeClass} ${className}`}
      style={{ ...style, x, y }}
    >
      <motion.div
        animate={
          shouldReduceMotion || !floatingAnimation
            ? { y: 0 }
            : { y: [0, -12, 0] }
        }
        className="relative h-full w-full"
        transition={
          shouldReduceMotion || !floatingAnimation
            ? { duration: 0.01 }
            : {
                duration: floatingAnimation.duration,
                delay: floatingAnimation.delay,
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
          {...(!shouldReduceMotion && variant === 'desktop'
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
              sizes="(min-width: 1280px) 260px, (min-width: 1024px) 220px, 100vw"
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
