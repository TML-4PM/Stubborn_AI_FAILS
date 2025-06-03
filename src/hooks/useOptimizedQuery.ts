
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { performanceCache } from '@/utils/performanceCache';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheNamespace?: string;
  enablePerformanceCache?: boolean;
  backgroundRefresh?: boolean;
}

export const useOptimizedQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) => {
  const {
    cacheNamespace = 'content',
    enablePerformanceCache = true,
    backgroundRefresh = true,
    ...queryOptions
  } = options;

  const cacheKey = queryKey.join('_');

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Try performance cache first
      if (enablePerformanceCache) {
        const cached = performanceCache.get<T>(cacheKey, cacheNamespace);
        if (cached) {
          // Start background refresh if enabled
          if (backgroundRefresh) {
            setTimeout(async () => {
              try {
                const fresh = await queryFn();
                performanceCache.set(cacheKey, fresh, cacheNamespace);
              } catch (error) {
                console.warn('Background refresh failed:', error);
              }
            }, 100);
          }
          return cached;
        }
      }

      // Fetch fresh data
      const data = await queryFn();
      
      // Cache the result
      if (enablePerformanceCache) {
        performanceCache.set(cacheKey, data, cacheNamespace);
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    ...queryOptions
  });
};

// Hook for optimized pagination
export const useOptimizedPagination = <T>(
  baseQueryKey: string[],
  fetchPage: (page: number) => Promise<T[]>,
  options: OptimizedQueryOptions<T[]> = {}
) => {
  const {
    cacheNamespace = 'pagination',
    ...queryOptions
  } = options;

  return {
    getPage: (page: number) => {
      return useOptimizedQuery(
        [...baseQueryKey, 'page', page.toString()],
        () => fetchPage(page),
        {
          cacheNamespace,
          staleTime: 10 * 60 * 1000, // 10 minutes for pagination
          ...queryOptions
        }
      );
    },
    
    prefetchPage: (page: number) => {
      const cacheKey = [...baseQueryKey, 'page', page.toString()].join('_');
      
      // Only prefetch if not already cached
      if (!performanceCache.get(cacheKey, cacheNamespace)) {
        setTimeout(() => {
          fetchPage(page).then(data => {
            performanceCache.set(cacheKey, data, cacheNamespace);
          }).catch(console.warn);
        }, 100);
      }
    }
  };
};
