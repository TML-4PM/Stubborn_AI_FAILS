
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  tags?: string[]; // Tags for cache invalidation
  serialize?: boolean; // Whether to serialize data
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const {
      ttl = this.defaultTTL,
      tags = [],
      serialize = true
    } = options;

    const item: CacheItem<T> = {
      data: serialize ? JSON.parse(JSON.stringify(data)) : data,
      timestamp: Date.now(),
      ttl,
      tags
    };

    this.cache.set(key, item);
    this.cleanup();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidateByTag(tag: string): void {
    for (const [key, item] of this.cache.entries()) {
      if (item.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  private cleanup(): void {
    if (this.cache.size > 1000) { // Limit cache size
      const now = Date.now();
      const entries = Array.from(this.cache.entries());
      
      // Remove expired items first
      entries.forEach(([key, item]) => {
        if (now - item.timestamp > item.ttl) {
          this.cache.delete(key);
        }
      });

      // If still too large, remove oldest items
      if (this.cache.size > 1000) {
        const sortedEntries = entries
          .sort((a, b) => a[1].timestamp - b[1].timestamp)
          .slice(0, this.cache.size - 900); // Keep newest 900

        sortedEntries.forEach(([key]) => this.cache.delete(key));
      }
    }
  }

  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const item of this.cache.values()) {
      if (now - item.timestamp > item.ttl) {
        expiredItems++;
      } else {
        validItems++;
      }
    }

    return {
      totalItems: this.cache.size,
      validItems,
      expiredItems,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    let size = 0;
    for (const [key, item] of this.cache.entries()) {
      size += key.length * 2; // String chars are 2 bytes
      size += JSON.stringify(item).length * 2;
    }
    return size;
  }
}

export const cache = new CacheManager();

// Browser cache utilities
export const browserCache = {
  // Use IndexedDB for large data
  async setLarge(key: string, data: any, ttl = 24 * 60 * 60 * 1000): Promise<void> {
    if (!('indexedDB' in window)) return;
    
    try {
      const request = indexedDB.open('AppCache', 1);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        
        store.put({
          data,
          timestamp: Date.now(),
          ttl
        }, key);
      };
    } catch (error) {
      console.warn('Failed to cache large data:', error);
    }
  },

  async getLarge<T>(key: string): Promise<T | null> {
    if (!('indexedDB' in window)) return null;

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('AppCache', 1);
        
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['cache'], 'readonly');
          const store = transaction.objectStore('cache');
          const getRequest = store.get(key);
          
          getRequest.onsuccess = () => {
            const result = getRequest.result;
            if (!result) {
              resolve(null);
              return;
            }

            const now = Date.now();
            if (now - result.timestamp > result.ttl) {
              // Expired, delete it
              const deleteTransaction = db.transaction(['cache'], 'readwrite');
              const deleteStore = deleteTransaction.objectStore('cache');
              deleteStore.delete(key);
              resolve(null);
              return;
            }

            resolve(result.data);
          };

          getRequest.onerror = () => resolve(null);
        };

        request.onerror = () => resolve(null);
      } catch (error) {
        console.warn('Failed to retrieve large cached data:', error);
        resolve(null);
      }
    });
  }
};

// Image caching utilities
export const imageCache = {
  preload(urls: string[]): Promise<void[]> {
    return Promise.all(
      urls.map(url => 
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Don't fail the entire batch
          img.src = url;
        })
      )
    );
  },

  async preloadWithPriority(urls: string[], maxConcurrent = 3): Promise<void> {
    const chunks = [];
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      chunks.push(urls.slice(i, i + maxConcurrent));
    }

    for (const chunk of chunks) {
      await this.preload(chunk);
    }
  }
};

// Service Worker cache utilities
export const swCache = {
  async invalidate(pattern: string): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_INVALIDATE',
        pattern
      });
    }
  },

  async preload(urls: string[]): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_PRELOAD',
        urls
      });
    }
  }
};
