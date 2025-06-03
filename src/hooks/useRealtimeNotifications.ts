
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

interface RealtimeNotification {
  id: string;
  type: 'achievement' | 'challenge' | 'like' | 'comment' | 'follow';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

export const useRealtimeNotifications = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time updates for user achievements
    const achievementChannel = supabase
      .channel('user-achievements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const achievement = payload.new;
          const notification: RealtimeNotification = {
            id: crypto.randomUUID(),
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: `You earned: ${achievement.achievement_name}`,
            timestamp: new Date(),
            read: false,
            data: achievement
          };
          
          addNotification(notification);
          
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `You earned: ${achievement.achievement_name}`,
          });
        }
      )
      .subscribe();

    // Subscribe to likes on user's content
    const likesChannel = supabase
      .channel('user-likes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_likes'
        },
        async (payload) => {
          const like = payload.new;
          
          // Check if this like is on the current user's content
          const { data: oopsie } = await supabase
            .from('oopsies')
            .select('user_id, title')
            .eq('id', like.oopsie_id)
            .single();

          if (oopsie?.user_id === user.id) {
            const notification: RealtimeNotification = {
              id: crypto.randomUUID(),
              type: 'like',
              title: 'New Like!',
              message: `Someone liked your post: ${oopsie.title}`,
              timestamp: new Date(),
              read: false,
              data: { oopsie_id: like.oopsie_id }
            };
            
            addNotification(notification);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(achievementChannel);
      supabase.removeChannel(likesChannel);
    };
  }, [user]);

  const addNotification = useCallback((notification: RealtimeNotification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  };
};
