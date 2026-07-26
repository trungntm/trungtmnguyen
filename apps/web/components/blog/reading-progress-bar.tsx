'use client';

import { useEffect, useRef } from 'react';

type ReadingProgressBarProps = {
  targetId: string;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function getReadingProgress(target: HTMLElement, topOffset: number) {
  const { height, top } = target.getBoundingClientRect();
  const viewportHeight = document.documentElement.clientHeight;
  const readingDistance = height + viewportHeight - topOffset;

  if (readingDistance <= 0) {
    return 0;
  }

  return clamp((viewportHeight - top) / readingDistance);
}

export function ReadingProgressBar({ targetId }: ReadingProgressBarProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const indicator = indicatorRef.current;
    const target = document.getElementById(targetId);
    const siteHeader = document.querySelector<HTMLElement>('[data-site-header]');

    if (!indicator || !target) {
      return;
    }

    let animationFrameId: number | null = null;
    let previousProgress = -1;

    const updateProgress = () => {
      animationFrameId = null;

      const topOffset = siteHeader?.getBoundingClientRect().bottom ?? 0;
      const progress = getReadingProgress(target, topOffset);

      if (progress !== previousProgress) {
        indicator.style.transform = `scaleX(${progress})`;
        previousProgress = progress;
      }
    };

    const scheduleUpdate = () => {
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(updateProgress);
      }
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(target);

    if (siteHeader) {
      resizeObserver.observe(siteHeader);
    }

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] overflow-hidden bg-border"
    >
      <div
        ref={indicatorRef}
        className="gradient-bg h-full origin-left opacity-90 motion-safe:transition-transform motion-safe:duration-100 motion-safe:ease-out motion-reduce:transition-none"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
