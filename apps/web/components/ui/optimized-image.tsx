import Image, { type ImageProps } from 'next/image';

import { cn } from '@/lib/utils';

export type OptimizedImageProps = Omit<ImageProps, 'unoptimized'> & {
  /**
   * By default, images are optimized by Next.js.
   * If you need to opt-out for specific images (e.g. SVGs), set this to true.
   */
  unoptimized?: boolean;
};

export function OptimizedImage({
  alt,
  className,
  unoptimized = false,
  quality = 85,
  ...props
}: OptimizedImageProps) {
  // If the image is an SVG, it shouldn't be optimized by Next.js
  const isSvg = typeof props.src === 'string' && props.src.endsWith('.svg');
  
  return (
    <Image
      alt={alt}
      className={cn(className)}
      quality={quality}
      unoptimized={unoptimized || isSvg}
      {...props}
    />
  );
}
