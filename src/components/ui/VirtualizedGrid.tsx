
import { useState, useRef, useEffect } from 'react';
import { useVirtualList } from '@/hooks/useVirtualList';
import { useThrottle } from '@/hooks/usePerformanceOptimization';

interface VirtualizedGridProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  gap?: number;
}

const VirtualizedGrid = <T,>({
  items,
  itemHeight,
  renderItem,
  className = '',
  gap = 16
}: VirtualizedGridProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  const { visibleItems, totalHeight } = useVirtualList({
    itemCount: items.length,
    itemHeight: itemHeight + gap,
    containerHeight,
    scrollTop
  });

  const throttledScroll = useThrottle((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, 16);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });

    container.addEventListener('scroll', throttledScroll);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', throttledScroll);
      resizeObserver.disconnect();
    };
  }, [throttledScroll]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: '100%' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, offsetTop }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offsetTop,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(items[index], index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedGrid;
