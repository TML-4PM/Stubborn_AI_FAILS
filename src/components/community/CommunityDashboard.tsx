
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, Calendar, Target, Crown, Medal, Award } from 'lucide-react';
import { useCommunityFeatures } from '@/hooks/useCommunityFeatures';
import { formatDistanceToNow } from 'date-fns';

const CommunityDashboard = () => {
  const { challenges, leaderboard, userParticipations, loading, joinChallenge } = useCommunityFeatures();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const isUserParticipating = (challengeId: string) => {
    return userParticipations.some(p => p.challenge_id === challengeId);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Community Hub</h1>
        <p className="text-muted-foreground">
          Join challenges, climb leaderboards, and connect with the community
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {challenges.length > 0 ? (
              challenges.map((challenge) => {
                const isParticipating = isUserParticipating(challenge.id);
                const endDate = new Date(challenge.end_date);
                const timeLeft = formatDistanceToNow(endDate, { addSuffix: true });
                const isExpired = endDate < new Date();

                return (
                  <div key={challenge.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {challenge.description}
                        </p>
                      </div>
                      <Badge 
                        variant={challenge.challenge_type === 'daily' ? 'default' : 'secondary'}
                      >
                        {challenge.challenge_type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {isExpired ? 'Ended' : 'Ends'} {timeLeft}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          {challenge.reward_points} points
                        </span>
                      </div>
                    </div>

                    {!isExpired && (
                      <Button
                        size="sm"
                        variant={isParticipating ? "outline" : "default"}
                        onClick={() => !isParticipating && joinChallenge(challenge.id)}
                        disabled={isParticipating}
                        className="w-full"
                      >
                        {isParticipating ? 'Participating' : 'Join Challenge'}
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active challenges at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div key={entry.user_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {getRankIcon(entry.rank)}
                      <div>
                        <p className="font-medium">
                          {entry.profiles?.username || 'Anonymous'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {entry.score} karma points
                        </p>
                      </div>
                    </div>
                    {entry.rank <= 3 && (
                      <Badge variant={entry.rank === 1 ? "default" : "secondary"}>
                        Top {entry.rank}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Leaderboard will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto text-primary mb-2" />
            <h3 className="text-2xl font-bold">1,234</h3>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto text-primary mb-2" />
            <h3 className="text-2xl font-bold">{challenges.length}</h3>
            <p className="text-sm text-muted-foreground">Active Challenges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto text-primary mb-2" />
            <h3 className="text-2xl font-bold">567</h3>
            <p className="text-sm text-muted-foreground">Total Achievements</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityDashboard;
