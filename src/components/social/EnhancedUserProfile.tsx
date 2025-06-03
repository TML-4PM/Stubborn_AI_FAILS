
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  MessageCircle, 
  Heart,
  Star,
  Award,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import UserReputationCard from '@/components/gamification/UserReputationCard';

interface ProfileData {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
}

interface UserStats {
  submissions_count: number;
  total_likes: number;
  total_comments: number;
  followers_count: number;
  following_count: number;
}

interface EnhancedUserProfileProps {
  userId: string;
}

const EnhancedUserProfile = ({ userId }: EnhancedUserProfileProps) => {
  const { user: currentUser } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [userSubmissions, setUserSubmissions] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    fetchProfile();
    fetchUserStats();
    fetchUserSubmissions();
    if (currentUser && !isOwnProfile) {
      checkFollowStatus();
    }
  }, [userId, currentUser]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get submissions count and total likes
      const { data: submissions, error: submissionsError } = await supabase
        .from('oopsies')
        .select('likes, comments')
        .eq('user_id', userId);

      if (submissionsError) throw submissionsError;

      // Get followers/following count
      const { count: followersCount } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      const { count: followingCount } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      // Get comments count
      const { count: commentsCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const totalLikes = submissions?.reduce((sum, sub) => sum + sub.likes, 0) || 0;
      const totalComments = submissions?.reduce((sum, sub) => sum + sub.comments, 0) || 0;

      setStats({
        submissions_count: submissions?.length || 0,
        total_likes: totalLikes,
        total_comments: commentsCount || 0,
        followers_count: followersCount || 0,
        following_count: followingCount || 0,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('oopsies')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setUserSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching user submissions:', error);
    }
  };

  const checkFollowStatus = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('*')
        .eq('follower_id', currentUser.id)
        .eq('following_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const toggleFollow = async () => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to follow users.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', userId);

        if (error) throw error;
        setIsFollowing(false);
        toast({ title: "Unfollowed successfully" });
      } else {
        const { error } = await supabase
          .from('user_follows')
          .insert({
            follower_id: currentUser.id,
            following_id: userId
          });

        if (error) throw error;
        setIsFollowing(true);
        toast({ title: "Following successfully" });
      }
      
      fetchUserStats(); // Refresh stats
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading || !profile) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="gradient-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {!isOwnProfile && currentUser && (
                <Button
                  onClick={toggleFollow}
                  variant={isFollowing ? "outline" : "default"}
                  className="w-full md:w-auto"
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
                <p className="text-muted-foreground">@{profile.username}</p>
                {profile.bio && (
                  <p className="text-sm mt-2">{profile.bio}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{stats.submissions_count}</p>
                    <p className="text-xs text-muted-foreground">Submissions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{stats.total_likes}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{stats.total_comments}</p>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{stats.followers_count}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{stats.following_count}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <Tabs defaultValue="submissions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submissions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Activity
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger value="reputation" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Reputation
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="submissions" className="space-y-4">
          {userSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSubmissions.map((submission) => (
                <Card key={submission.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                  {submission.image_url && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={submission.image_url}
                        alt={submission.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {submission.is_featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">
                          Featured
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardContent className="p-4 space-y-2">
                    <h4 className="font-semibold line-clamp-2">{submission.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {submission.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {submission.likes}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {submission.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile ? "Start sharing your content!" : "This user hasn't shared anything yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
              <p className="text-muted-foreground">
                Activity feed coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="reputation">
            <UserReputationCard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EnhancedUserProfile;
