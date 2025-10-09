
import { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import EnhancedSkeleton from './EnhancedSkeleton';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
  priority?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage = ({
  src,
  alt,
  className,
  width,
  height,
  blurDataUrl,
  priority = false,
  fallbackSrc = '/placeholder.svg',
  onLoad,
  onError
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true
  });

  const shouldLoad = priority || isVisible;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={elementRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {blurDataUrl && !isLoaded && (
        <img
          src={blurDataUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 filter blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {!shouldLoad && (
        <EnhancedSkeleton className="w-full h-full" />
      )}

      {/* Main image */}
      {shouldLoad && !hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

{/* Error state with fallback image */}
{hasError && (
  <img
    src={fallbackSrc}
    alt={alt}
    className="absolute inset-0 w-full h-full object-cover"
  />
)}

      {/* Loading overlay */}
      {shouldLoad && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;
