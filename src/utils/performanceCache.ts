
interface CacheStrategy {
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'fifo' | 'ttl';
}

interface PerformanceCacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

class PerformanceCache {
  private cache = new Map<string, PerformanceCacheItem<any>>();
  private strategies: { [key: string]: CacheStrategy } = {
    feeds: { ttl: 5 * 60 * 1000, maxSize: 100, strategy: 'lru' },
    content: { ttl: 15 * 60 * 1000, maxSize: 500, strategy: 'lru' },
    user: { ttl: 30 * 60 * 1000, maxSize: 200, strategy: 'ttl' },
    search: { ttl: 10 * 60 * 1000, maxSize: 150, strategy: 'fifo' }
  };

  set<T>(key: string, data: T, namespace: string = 'default'): void {
    const strategy = this.strategies[namespace] || this.strategies.content;
    
    // Check if cache is full and needs cleanup
    if (this.cache.size >= strategy.maxSize) {
      this.cleanup(namespace, strategy);
    }

    const item: PerformanceCacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: strategy.ttl,
      accessCount: 0,
      lastAccessed: Date.now()
    };

    this.cache.set(`${namespace}:${key}`, item);
  }

  get<T>(key: string, namespace: string = 'default'): T | null {
    const fullKey = `${namespace}:${key}`;
    const item = this.cache.get(fullKey);
    
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(fullKey);
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = now;
    
    return item.data as T;
  }

  invalidateNamespace(namespace: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.startsWith(`${namespace}:`)
    );
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private cleanup(namespace: string, strategy: CacheStrategy): void {
    const namespaceKeys = Array.from(this.cache.entries())
      .filter(([key]) => key.startsWith(`${namespace}:`))
      .map(([key, value]) => ({ key, ...value }));

    let itemsToRemove: string[] = [];

    switch (strategy.strategy) {
      case 'lru':
        itemsToRemove = namespaceKeys
          .sort((a, b) => a.lastAccessed - b.lastAccessed)
          .slice(0, Math.floor(namespaceKeys.length * 0.2))
          .map(item => item.key);
        break;
      case 'fifo':
        itemsToRemove = namespaceKeys
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(0, Math.floor(namespaceKeys.length * 0.2))
          .map(item => item.key);
        break;
      case 'ttl':
        const now = Date.now();
        itemsToRemove = namespaceKeys
          .filter(item => now - item.timestamp > item.ttl * 0.8)
          .map(item => item.key);
        break;
    }

    itemsToRemove.forEach(key => this.cache.delete(key));
  }

  getStats() {
    const stats = {
      totalItems: this.cache.size,
      memoryUsage: this.estimateMemoryUsage(),
      hitRate: 0,
      namespaces: {} as { [key: string]: number }
    };

    // Calculate namespace distribution
    for (const key of this.cache.keys()) {
      const namespace = key.split(':')[0];
      stats.namespaces[namespace] = (stats.namespaces[namespace] || 0) + 1;
    }

    return stats;
  }

  private estimateMemoryUsage(): number {
    let size = 0;
    for (const [key, item] of this.cache.entries()) {
      size += key.length * 2;
      size += JSON.stringify(item).length * 2;
    }
    return size;
  }
}

export const performanceCache = new PerformanceCache();

// Preload critical content - moved here from performanceOptimizer to avoid circular imports
export const preloadCriticalContent = async () => {
  try {
    // Preload featured content
    const featuredKey = 'featured_content';
    if (!performanceCache.get(featuredKey, 'feeds')) {
      // This would be implemented with actual API call
      console.log('Preloading featured content...');
    }

    // Preload trending tags
    const trendingKey = 'trending_tags';
    if (!performanceCache.get(trendingKey, 'content')) {
      console.log('Preloading trending tags...');
    }
  } catch (error) {
    console.error('Failed to preload critical content:', error);
  }
};
