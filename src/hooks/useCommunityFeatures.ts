
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  start_date: string;
  end_date: string;
  reward_points: number;
  is_active: boolean;
}

interface LeaderboardEntry {
  user_id: string;
  score: number;
  rank: number;
  profiles?: { username: string } | null;
}

export const useCommunityFeatures = () => {
  const { user } = useUser();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userParticipations, setUserParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
    fetchLeaderboard();
    if (user) {
      fetchUserParticipations();
    }
  }, [user]);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('community_challenges')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('user_reputation')
        .select(`
          user_id,
          total_karma,
          profiles(username)
        `)
        .order('total_karma', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const leaderboardData = (data || []).map((entry, index) => ({
        user_id: entry.user_id,
        score: entry.total_karma,
        rank: index + 1,
        profiles: entry.profiles
      }));
      
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserParticipations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_challenge_participations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserParticipations(data || []);
    } catch (error) {
      console.error('Error fetching user participations:', error);
    }
  };

  const joinChallenge = async (challengeId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to join challenges.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_challenge_participations')
        .insert({
          user_id: user.id,
          challenge_id: challengeId
        });

      if (error) throw error;
      
      toast({
        title: "Challenge joined!",
        description: "You've successfully joined the challenge."
      });
      
      fetchUserParticipations();
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    challenges,
    leaderboard,
    userParticipations,
    loading,
    joinChallenge,
    refetch: () => {
      fetchChallenges();
      fetchLeaderboard();
      fetchUserParticipations();
    }
  };
};
