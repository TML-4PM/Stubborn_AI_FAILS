
import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { performanceCache } from '@/utils/performanceCache';

interface UseRealTimeOptimizedProps {
  table: string;
  filter?: any;
  onUpdate?: (payload: any) => void;
  enableBatching?: boolean;
  batchDelay?: number;
}

export const useRealTimeOptimized = ({
  table,
  filter,
  onUpdate,
  enableBatching = true,
  batchDelay = 1000
}: UseRealTimeOptimizedProps) => {
  const batchRef = useRef<any[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const processBatch = useCallback(() => {
    if (batchRef.current.length > 0 && onUpdate) {
      onUpdate(batchRef.current);
      batchRef.current = [];
    }
  }, [onUpdate]);

  const handleRealTimeUpdate = useCallback((payload: any) => {
    // Invalidate relevant cache entries
    performanceCache.invalidateNamespace('content');
    performanceCache.invalidateNamespace('feeds');

    if (enableBatching) {
      batchRef.current.push(payload);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(processBatch, batchDelay);
    } else {
      onUpdate?.(payload);
    }
  }, [enableBatching, batchDelay, processBatch, onUpdate]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter
        },
        handleRealTimeUpdate
      )
      .subscribe();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [table, filter, handleRealTimeUpdate]);

  // Force process any remaining batch items
  useEffect(() => {
    return () => {
      if (batchRef.current.length > 0) {
        processBatch();
      }
    };
  }, [processBatch]);
};

// Hook for optimized presence tracking
export const usePresenceOptimized = (channelName: string) => {
  const presenceRef = useRef<any>({});

  useEffect(() => {
    const channel = supabase.channel(channelName);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        presenceRef.current = state;
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            user_agent: navigator.userAgent
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  return presenceRef.current;
};
