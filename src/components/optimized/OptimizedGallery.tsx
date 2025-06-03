
import { useState, useCallback, useRef, useEffect } from 'react';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { useVirtualScrollOptimized } from '@/hooks/useVirtualScrollOptimized';
import { useRealTimeOptimized } from '@/hooks/useRealTimeOptimized';
import FailCard from '@/components/FailCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedGalleryProps {
  category?: string;
  searchQuery?: string;
  enableRealTime?: boolean;
}

const OptimizedGallery = ({ 
  category, 
  searchQuery, 
  enableRealTime = true 
}: OptimizedGalleryProps) => {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  // Fetch data with optimized caching
  const { data: items, isLoading, refetch } = useOptimizedQuery(
    ['gallery', category || 'all', searchQuery || '', page.toString()],
    async () => {
      let query = supabase
        .from('oopsies')
        .select(`
          *,
          profiles(username)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .range((page - 1) * 20, page * 20 - 1);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const transformedData = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        likes: item.likes || 0,
        created_at: item.created_at,
        status: item.status,
        username: (item.profiles as any)?.username || 'Anonymous'
      }));

      return transformedData;
    },
    {
      cacheNamespace: 'gallery',
      staleTime: 5 * 60 * 1000, // 5 minutes
      backgroundRefresh: true
    }
  );

  // Update all items when new data arrives
  useEffect(() => {
    if (items) {
      if (page === 1) {
        setAllItems(items);
      } else {
        setAllItems(prev => [...prev, ...items]);
      }
      setHasMore(items.length === 20);
    }
  }, [items, page]);

  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setAllItems([]);
    setHasMore(true);
  }, [category, searchQuery]);

  // Real-time updates
  useRealTimeOptimized({
    table: 'oopsies',
    onUpdate: useCallback((payloads) => {
      // Refresh the first page to get latest content
      if (page === 1) {
        refetch();
      }
    }, [page, refetch]),
    enableBatching: true,
    batchDelay: 2000
  });

  // Load more items
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  // Measure container height
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Virtual scrolling for performance
  const {
    visibleItems,
    totalHeight,
    handleScroll,
    isScrolling
  } = useVirtualScrollOptimized({
    items: allItems,
    itemHeight: 320, // Approximate height of FailCard
    containerHeight,
    overscan: 3,
    onLoadMore: loadMore,
    loadMoreThreshold: 5
  });

  return (
    <div className="h-full">
      <div
        ref={containerRef}
        className="h-full overflow-auto"
        onScroll={handleScroll}
      >
        <div
          style={{ height: totalHeight, position: 'relative' }}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {visibleItems.map(({ item, index, offsetTop }) => (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  top: Math.floor(index / 4) * 320, // 4 columns
                  left: `${(index % 4) * 25}%`,
                  width: '23%'
                }}
              >
                <FailCard
                  id={item.id}
                  image={item.image_url}
                  name={item.title}
                  description={item.description}
                  likeCount={item.likes}
                  author={item.username}
                  timestamp={item.created_at}
                  status={item.status}
                />
              </div>
            ))}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Scroll indicator for performance */}
          {isScrolling && (
            <div className="fixed top-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-xs">
              Scrolling...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizedGallery;
