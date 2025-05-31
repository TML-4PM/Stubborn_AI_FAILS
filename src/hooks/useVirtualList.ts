
import { useMemo } from 'react';

interface UseVirtualListProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}

export const useVirtualList = ({
  itemCount,
  itemHeight,
  containerHeight,
  scrollTop,
  overscan = 5
}: UseVirtualListProps) => {
  return useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      itemCount,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = [];
    for (let i = startIndex; i < endIndex; i++) {
      visibleItems.push({
        index: i,
        offsetTop: i * itemHeight
      });
    }

    return {
      startIndex,
      endIndex,
      visibleItems,
      totalHeight: itemCount * itemHeight
    };
  }, [itemCount, itemHeight, containerHeight, scrollTop, overscan]);
};
