
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, TrendingUp, MessageCircle, Heart } from 'lucide-react';
import { useUserReputation } from '@/hooks/useUserReputation';

const UserReputationCard = () => {
  const { reputation, achievements, loading } = useUserReputation();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reputation) return null;

  const getReputationLevel = (karma: number) => {
    if (karma >= 10000) return { level: 'Legend', color: 'bg-purple-500', progress: 100 };
    if (karma >= 5000) return { level: 'Expert', color: 'bg-blue-500', progress: (karma / 10000) * 100 };
    if (karma >= 1000) return { level: 'Advanced', color: 'bg-green-500', progress: (karma / 5000) * 100 };
    if (karma >= 100) return { level: 'Intermediate', color: 'bg-yellow-500', progress: (karma / 1000) * 100 };
    return { level: 'Beginner', color: 'bg-gray-500', progress: (karma / 100) * 100 };
  };

  const { level, color, progress } = getReputationLevel(reputation.total_karma);

  return (
    <Card className="gradient-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Your Reputation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Badge */}
        <div className="text-center">
          <Badge className={`${color} text-white px-4 py-2 text-lg font-bold`}>
            {level}
          </Badge>
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {reputation.total_karma} total karma
            </p>
          </div>
        </div>

        {/* Karma Breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <TrendingUp className="h-4 w-4 mx-auto text-green-500" />
            <p className="text-sm font-medium">{reputation.submission_karma}</p>
            <p className="text-xs text-muted-foreground">Submissions</p>
          </div>
          <div className="space-y-1">
            <MessageCircle className="h-4 w-4 mx-auto text-blue-500" />
            <p className="text-sm font-medium">{reputation.comment_karma}</p>
            <p className="text-xs text-muted-foreground">Comments</p>
          </div>
          <div className="space-y-1">
            <Heart className="h-4 w-4 mx-auto text-red-500" />
            <p className="text-sm font-medium">{reputation.like_karma}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{achievement.achievement_name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge variant="outline">+{achievement.points}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserReputationCard;
