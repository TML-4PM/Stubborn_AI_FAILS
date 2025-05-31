
import { useState, useEffect } from 'react';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';
import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  showSpinner?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const ProgressiveImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  showSpinner = true,
  onLoad,
  onError
}: ProgressiveImageProps) => {
  const {
    isLoaded,
    isInView,
    hasError,
    blurDataUrl,
    containerRef,
    handleLoad,
    handleError
  } = useOptimizedImage({ src, priority });

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShowImage(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const handleImageLoad = () => {
    handleLoad();
    onLoad?.();
  };

  const handleImageError = () => {
    handleError();
    onError?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-muted', className)}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {blurDataUrl && (
        <img
          src={blurDataUrl}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover scale-110 filter blur-sm transition-opacity duration-500',
            showImage ? 'opacity-0' : 'opacity-100'
          )}
          aria-hidden="true"
        />
      )}

      {/* Loading spinner */}
      {showSpinner && !isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="md" variant="secondary" />
        </div>
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            showImage ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <span className="text-sm">Failed to load</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;
