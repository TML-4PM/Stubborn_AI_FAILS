
import { useState, useEffect } from 'react';
import { Clock, Heart, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  type: 'submission' | 'like' | 'comment';
  username: string;
  title: string;
  timestamp: Date;
  likes?: number;
}

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Simulate live activities
    const generateActivity = (): Activity => ({
      id: Math.random().toString(36),
      type: ['submission', 'like', 'comment'][Math.floor(Math.random() * 3)] as Activity['type'],
      username: ['Sarah_AI', 'TechBro99', 'AIEnthusiast', 'PromptMaster', 'CodeNewbie'][Math.floor(Math.random() * 5)],
      title: [
        'ChatGPT thinks I\'m a sandwich',
        'DALL-E made a cat with 8 legs',
        'Claude refuses to count to 10',
        'AI thinks my cat is furniture',
        'Copilot wrote a love letter to a bug'
      ][Math.floor(Math.random() * 5)],
      timestamp: new Date(),
      likes: Math.floor(Math.random() * 100)
    });

    // Initial activities
    setActivities(Array.from({ length: 5 }, generateActivity));
    
    // Simulate user count
    setUserCount(Math.floor(Math.random() * 3000) + 5000);

    // Add new activity every 3-8 seconds
    const interval = setInterval(() => {
      setActivities(prev => [generateActivity(), ...prev.slice(0, 4)]);
      setUserCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'submission': return <TrendingUp className="w-3 h-3 text-blue-500" />;
      case 'like': return <Heart className="w-3 h-3 text-red-500" />;
      case 'comment': return <MessageCircle className="w-3 h-3 text-green-500" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'submission': return 'submitted';
      case 'like': return 'liked';
      case 'comment': return 'commented on';
    }
  };

  return (
    <div className="space-y-4">
      {/* Live User Counter */}
      <GlassCard className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Users className="w-4 h-4" />
          <span className="font-semibold">{userCount.toLocaleString()} people</span>
          <span className="text-muted-foreground">laughing right now</span>
        </div>
      </GlassCard>

      {/* Live Activity Feed */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-sm">Live Activity</h3>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-hidden">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-2 text-xs animate-fade-in">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {activity.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex items-center gap-1 flex-1 min-w-0">
                {getActivityIcon(activity.type)}
                <span className="font-medium truncate">{activity.username}</span>
                <span className="text-muted-foreground">{getActivityText(activity)}</span>
                <span className="truncate font-medium">"{activity.title}"</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>just now</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default LiveActivityFeed;
