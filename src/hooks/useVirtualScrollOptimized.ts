
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useThrottle } from '@/hooks/usePerformanceOptimization';

interface UseVirtualScrollOptimizedProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  onLoadMore?: () => void;
  loadMoreThreshold?: number;
}

export const useVirtualScrollOptimized = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  onLoadMore,
  loadMoreThreshold = 10
}: UseVirtualScrollOptimizedProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const throttledScroll = useThrottle((scrollTop: number) => {
    setScrollTop(scrollTop);
    setIsScrolling(false);
  }, 16);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setIsScrolling(true);
    throttledScroll(target.scrollTop);

    // Trigger load more
    if (onLoadMore && loadMoreThreshold) {
      const { scrollTop, scrollHeight, clientHeight } = target;
      const scrolledPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrolledPercentage > 0.8) { // 80% scrolled
        onLoadMore();
      }
    }
  }, [throttledScroll, onLoadMore, loadMoreThreshold]);

  const virtualizedData = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = [];
    for (let i = startIndex; i < endIndex; i++) {
      visibleItems.push({
        index: i,
        item: items[i],
        offsetTop: i * itemHeight,
        isVisible: i >= Math.floor(scrollTop / itemHeight) && 
                  i <= Math.ceil((scrollTop + containerHeight) / itemHeight)
      });
    }

    return {
      visibleItems,
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
      overscanStartIndex: Math.max(0, startIndex - overscan),
      overscanEndIndex: Math.min(items.length, endIndex + overscan)
    };
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  // Preload images for visible and upcoming items
  useEffect(() => {
    const preloadImages = async () => {
      const imagesToPreload = virtualizedData.visibleItems
        .slice(0, 10) // Limit preloading
        .map(({ item }) => item?.image_url)
        .filter(Boolean);

      // Simple image preloading
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    preloadImages();
  }, [virtualizedData.visibleItems]);

  return {
    ...virtualizedData,
    handleScroll,
    isScrolling,
    scrollTop
  };
};
