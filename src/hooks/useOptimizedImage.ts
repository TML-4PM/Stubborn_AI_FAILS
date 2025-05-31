
import { useState, useEffect, useRef } from 'react';
import { createLazyLoadObserver } from '@/utils/imageOptimization';

interface UseOptimizedImageProps {
  src: string;
  priority?: boolean;
  blur?: boolean;
}

export const useOptimizedImage = ({ src, priority = false, blur = true }: UseOptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy loading setup
  useEffect(() => {
    if (priority) return;

    const observer = createLazyLoadObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  return {
    isLoaded,
    isInView,
    hasError,
    blurDataUrl,
    containerRef,
    handleLoad,
    handleError
  };
};
