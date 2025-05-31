
import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks/usePerformanceOptimization';
import { AIFail } from '@/data/sampleFails';

interface SearchFilters {
  query: string;
  categories: string[];
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy: 'relevance' | 'newest' | 'oldest' | 'popular';
  contentType: 'all' | 'image' | 'text' | 'video';
}

interface SearchResult {
  item: AIFail;
  score: number;
  highlights: {
    title?: string;
    description?: string;
    tags?: string[];
  };
}

export const useAdvancedSearch = (items: AIFail[]) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    tags: [],
    sortBy: 'relevance',
    contentType: 'all'
  });
  
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Full-text search with ranking
  const searchItems = useCallback((query: string, items: AIFail[]): SearchResult[] => {
    if (!query.trim()) return items.map(item => ({ item, score: 1, highlights: {} }));

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return items.map(item => {
      let score = 0;
      const highlights: SearchResult['highlights'] = {};

      // Title matching (highest weight)
      const titleLower = item.title.toLowerCase();
      const titleMatches = searchTerms.filter(term => titleLower.includes(term));
      score += titleMatches.length * 10;
      
      if (titleMatches.length > 0) {
        highlights.title = highlightText(item.title, searchTerms);
      }

      // Description matching (medium weight)
      const descLower = item.description.toLowerCase();
      const descMatches = searchTerms.filter(term => descLower.includes(term));
      score += descMatches.length * 5;
      
      if (descMatches.length > 0) {
        highlights.description = highlightText(item.description, searchTerms);
      }

      // Tag matching (medium weight)
      const tagMatches = item.tags?.filter(tag => 
        searchTerms.some(term => tag.toLowerCase().includes(term))
      ) || [];
      score += tagMatches.length * 3;
      
      if (tagMatches.length > 0) {
        highlights.tags = tagMatches;
      }

      // Category matching (low weight)
      if (item.category && searchTerms.some(term => 
        item.category!.toLowerCase().includes(term)
      )) {
        score += 2;
      }

      // Username matching (low weight)
      if (searchTerms.some(term => 
        item.username.toLowerCase().includes(term)
      )) {
        score += 1;
      }

      return { item, score, highlights };
    }).filter(result => result.score > 0);
  }, []);

  const highlightText = (text: string, terms: string[]): string => {
    let highlighted = text;
    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });
    return highlighted;
  };

  const debouncedSearch = useDebounce((searchFilters: SearchFilters) => {
    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      setIsSearching(false);
    }, 200);
  }, 300);

  const filteredAndSearchedItems = useMemo(() => {
    let results = searchItems(filters.query, items);

    // Apply category filters
    if (filters.categories.length > 0) {
      results = results.filter(result => 
        result.item.category && filters.categories.includes(result.item.category)
      );
    }

    // Apply tag filters
    if (filters.tags.length > 0) {
      results = results.filter(result =>
        result.item.tags?.some(tag => filters.tags.includes(tag))
      );
    }

    // Apply date range filter - using createdAt instead of timestamp
    if (filters.dateRange) {
      results = results.filter(result => {
        const itemDate = new Date(result.item.createdAt);
        return itemDate >= filters.dateRange!.start && itemDate <= filters.dateRange!.end;
      });
    }

    // Apply content type filter
    if (filters.contentType !== 'all') {
      results = results.filter(result => {
        // Implement content type detection based on your data structure
        return true; // Placeholder
      });
    }

    // Sort results
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'relevance':
          return b.score - a.score;
        case 'newest':
          return new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime();
        case 'oldest':
          return new Date(a.item.createdAt).getTime() - new Date(b.item.createdAt).getTime();
        case 'popular':
          return (b.item.likes || 0) - (a.item.likes || 0);
        default:
          return 0;
      }
    });

    return results;
  }, [filters, items, searchItems]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    debouncedSearch({ ...filters, ...newFilters });
  };

  const addToHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)]); // Keep last 10 searches
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return {
    filters,
    updateFilters,
    results: filteredAndSearchedItems,
    searchHistory,
    addToHistory,
    clearHistory,
    isSearching,
    totalResults: filteredAndSearchedItems.length
  };
};
