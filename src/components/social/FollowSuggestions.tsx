import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, RefreshCw } from 'lucide-react';
import UserProfileCard from './UserProfileCard';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface SuggestedUser {
  userId: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  followersCount: number;
  submissionsCount: number;
  mutualFollowersCount: number;
  isVerified: boolean;
  isTrendingCreator: boolean;
  isTopContributor: boolean;
}

const FollowSuggestions = () => {
  const { user } = useUser();
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const fetchSuggestions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get users with most followers that current user doesn't follow
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          username,
          avatar_url,
          bio
        `)
        .neq('user_id', user.id)
        .limit(5);

      if (error) throw error;

      // Get stats for each user
      const suggestionsWithStats = await Promise.all(
        profiles.map(async (profile) => {
          // Get followers count
          const { count: followersCount } = await supabase
            .from('user_follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', profile.user_id);

          // Get submissions count
          const { count: submissionsCount } = await supabase
            .from('oopsies')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.user_id)
            .eq('status', 'approved');

          // Check if already following
          const { count: isFollowingCount } = await supabase
            .from('user_follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', user.id)
            .eq('following_id', profile.user_id);

          // Get mutual followers (people who follow both)
          const { count: mutualCount } = await supabase
            .from('user_follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', profile.user_id)
            .in('follower_id', [
              // This would need a subquery for actual mutual followers
            ]);

          return {
            userId: profile.user_id,
            username: profile.username,
            avatarUrl: profile.avatar_url,
            bio: profile.bio,
            followersCount: followersCount || 0,
            submissionsCount: submissionsCount || 0,
            mutualFollowersCount: mutualCount || 0,
            isVerified: false, // TODO: Add verification logic
            isTrendingCreator: (submissionsCount || 0) > 10,
            isTopContributor: (followersCount || 0) > 100,
            isFollowing: (isFollowingCount || 0) > 0,
          };
        })
      );

      // Filter out users already following and sort by relevance
      const filtered = suggestionsWithStats
        .filter((s) => !s.isFollowing)
        .sort((a, b) => {
          // Sort by: trending > top contributor > followers > submissions
          if (a.isTrendingCreator && !b.isTrendingCreator) return -1;
          if (!a.isTrendingCreator && b.isTrendingCreator) return 1;
          if (a.isTopContributor && !b.isTopContributor) return -1;
          if (!a.isTopContributor && b.isTopContributor) return 1;
          return b.followersCount - a.followersCount;
        })
        .slice(0, 3);

      setSuggestions(filtered);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Suggested for you
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-24" />
                <div className="h-3 bg-muted rounded animate-pulse w-32" />
              </div>
              <div className="h-8 w-20 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Suggested for you
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchSuggestions}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <UserProfileCard
            key={suggestion.userId}
            {...suggestion}
            compact
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default FollowSuggestions;