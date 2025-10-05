import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

const PAGE_SIZE = 20;

export const usePersonalizedFeed = () => {
  const { user } = useUser();
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadFeed = async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      const offset = pageNum * PAGE_SIZE;

      // Simple query for now - will be replaced with personalized feed functions
      const { data, error } = await supabase
        .from('oopsies')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;

      const result = data || [];

      if (result.length > 0) {
        setFeed(prev => append ? [...prev, ...result] : result);
        setHasMore(result.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed(0);
  }, [user]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadFeed(nextPage, true);
    }
  };

  const refresh = () => {
    setPage(0);
    setFeed([]);
    setHasMore(true);
    loadFeed(0);
  };

  return {
    feed,
    loading,
    hasMore,
    loadMore,
    refresh,
  };
};
