'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HeroImageCard } from './hero-image-card';
import { heroVisualItems } from './hero-visual-data';

type MobileHeroCarouselProps = {
  shouldReduceMotion: boolean;
};

const AUTO_ROTATE_INTERVAL = 5000; // 5 seconds

export function MobileHeroCarousel({ shouldReduceMotion }: MobileHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroVisualItems.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const activeItem = heroVisualItems[activeIndex];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center md:hidden pt-8 pb-14 px-5 sm:px-6">
      <div className="relative w-[96%] sm:w-[98%] max-w-lg flex-1 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeItem ? (
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.4,
                ease: 'easeInOut',
              }}
              className="absolute inset-0"
            >
              <HeroImageCard
                item={activeItem}
                shouldReduceMotion={shouldReduceMotion}
                variant="mobile"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 flex gap-2">
        {heroVisualItems.map((item, index) => (
          <button
            key={item.id}
            aria-label={`Go to ${item.label} slide`}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-primary' : 'bg-primary/30'
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
