
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

const PullToRefresh = ({ onRefresh, children, className }: PullToRefreshProps) => {
  const handleRefresh = async () => {
    const result = onRefresh();
    if (result instanceof Promise) {
      await result;
    }
  };

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isRefreshing,
    pullDistance,
    canRefresh,
    refreshProgress
  } = usePullToRefresh({ onRefresh: handleRefresh });

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-transform duration-200 z-10"
        style={{
          transform: `translateY(${Math.max(pullDistance - 60, -60)}px)`,
          opacity: pullDistance > 0 ? refreshProgress : 0
        }}
      >
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <RefreshCw 
            className={cn(
              'w-4 h-4 transition-transform duration-300',
              isRefreshing && 'animate-spin',
              canRefresh && !isRefreshing && 'rotate-180'
            )} 
          />
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : canRefresh ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance * 0.5}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
