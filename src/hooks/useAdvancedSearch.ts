
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchFilters {
  query: string;
  category: string;
  tags: string[];
  sortBy: 'trending' | 'newest' | 'popular' | 'viral';
  timeRange: 'all' | 'today' | 'week' | 'month';
  minLikes: number;
  featuredOnly: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  trending_score: number;
  viral_score: number;
  created_at: string;
  is_featured: boolean;
  profiles?: { username: string } | null;
}

export const useAdvancedSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    tags: [],
    sortBy: 'trending',
    timeRange: 'all',
    minLikes: 0,
    featuredOnly: false
  });

  const availableCategories = ['Technology', 'Sports', 'Entertainment', 'Science', 'Politics', 'Other'];
  const availableTags = ['AI', 'Social Media', 'Breaking', 'Viral', 'Trending', 'Exclusive'];

  const search = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('oopsies')
        .select(`
          *,
          profiles(username)
        `)
        .eq('status', 'approved');

      // Apply filters
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.featuredOnly) {
        query = query.eq('is_featured', true);
      }

      if (filters.minLikes > 0) {
        query = query.gte('likes', filters.minLikes);
      }

      // Time range filter
      if (filters.timeRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (filters.timeRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            startDate = new Date(0);
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      // Sorting
      switch (filters.sortBy) {
        case 'trending':
          query = query.order('trending_score', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('likes', { ascending: false });
          break;
        case 'viral':
          query = query.order('viral_score', { ascending: false });
          break;
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, [filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    results,
    loading,
    filters,
    updateFilters,
    search,
    availableCategories,
    availableTags
  };
};
