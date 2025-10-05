import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, UserPlus, UserCheck, Shield, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

interface UserProfileCardProps {
  userId: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  isVerified?: boolean;
  isTrendingCreator?: boolean;
  isTopContributor?: boolean;
  followersCount?: number;
  submissionsCount?: number;
  compact?: boolean;
}

const UserProfileCard = ({
  userId,
  username,
  avatarUrl,
  bio,
  isVerified = false,
  isTrendingCreator = false,
  isTopContributor = false,
  followersCount = 0,
  submissionsCount = 0,
  compact = false,
}: UserProfileCardProps) => {
  const { user: currentUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  const handleFollow = async () => {
    if (!currentUser) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to follow users',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', userId);
        setIsFollowing(false);
        toast({ title: 'Unfollowed successfully' });
      } else {
        await supabase
          .from('user_follows')
          .insert({ follower_id: currentUser.id, following_id: userId });
        setIsFollowing(true);
        toast({ title: 'Following successfully' });
      }
    } catch (error) {
      console.error('Follow error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update follow status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 group">
        <Link to={`/user/${userId}`} className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10 ring-2 ring-background group-hover:ring-primary transition-all">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {username}
              </p>
              {isVerified && (
                <Badge variant="secondary" className="h-4 px-1">
                  <Shield className="h-3 w-3 text-primary" />
                </Badge>
              )}
              {isTrendingCreator && (
                <Badge variant="secondary" className="h-4 px-1">
                  <TrendingUp className="h-3 w-3 text-orange-500" />
                </Badge>
              )}
              {isTopContributor && (
                <Badge variant="secondary" className="h-4 px-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {followersCount} followers · {submissionsCount} posts
            </p>
          </div>
        </Link>
        {!isOwnProfile && (
          <Button
            size="sm"
            variant={isFollowing ? 'outline' : 'default'}
            onClick={handleFollow}
            disabled={isLoading}
            className="shrink-0"
          >
            {isFollowing ? (
              <>
                <UserCheck className="h-4 w-4 mr-1" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <Link to={`/user/${userId}`}>
            <Avatar className="h-20 w-20 ring-4 ring-background hover:ring-primary transition-all">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="space-y-2">
            <Link to={`/user/${userId}`} className="group">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {username}
                </h3>
                <div className="flex gap-1">
                  {isVerified && (
                    <Badge variant="secondary" className="h-5 px-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                    </Badge>
                  )}
                  {isTrendingCreator && (
                    <Badge variant="secondary" className="h-5 px-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                    </Badge>
                  )}
                  {isTopContributor && (
                    <Badge variant="secondary" className="h-5 px-1.5">
                      <Star className="h-3.5 w-3.5 text-yellow-500" />
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
            
            {bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {bio}
              </p>
            )}
            
            <div className="flex justify-center gap-4 text-sm">
              <div>
                <span className="font-semibold">{followersCount}</span>
                <span className="text-muted-foreground ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold">{submissionsCount}</span>
                <span className="text-muted-foreground ml-1">posts</span>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <Button
              className="w-full"
              variant={isFollowing ? 'outline' : 'default'}
              onClick={handleFollow}
              disabled={isLoading}
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
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;