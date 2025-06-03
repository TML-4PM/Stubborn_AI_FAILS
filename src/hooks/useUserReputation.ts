
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface UserReputation {
  total_karma: number;
  submission_karma: number;
  comment_karma: number;
  like_karma: number;
}

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  points: number;
  unlocked_at: string;
}

export const useUserReputation = () => {
  const { user } = useUser();
  const [reputation, setReputation] = useState<UserReputation | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserReputation();
      fetchUserAchievements();
    }
  }, [user]);

  const fetchUserReputation = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_reputation')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching reputation:', error);
        return;
      }

      setReputation(data);
    } catch (error) {
      console.error('Error fetching reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        return;
      }

      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  return {
    reputation,
    achievements,
    loading,
    refetch: () => {
      fetchUserReputation();
      fetchUserAchievements();
    }
  };
};
