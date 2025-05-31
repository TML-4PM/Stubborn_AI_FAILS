
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Youtube, Play, Eye, Heart, ExternalLink } from 'lucide-react';
import { useYouTube } from '@/hooks/useYouTube';
import { formatDistanceToNow } from 'date-fns';

const YouTubeChannel = () => {
  const { channelVideos, isLoadingVideos, fetchChannelVideos } = useYouTube();

  useEffect(() => {
    fetchChannelVideos();
  }, [fetchChannelVideos]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoadingVideos) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="flex">
              <div className="w-48 h-28 bg-muted"></div>
              <div className="flex-1 p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500 rounded-full">
            <Youtube className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Fails YouTube Channel</h2>
            <p className="text-muted-foreground">Latest videos from our community</p>
          </div>
        </div>
        <Button
          onClick={() => window.open('https://youtube.com/@aifails', '_blank')}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Youtube className="mr-2 h-4 w-4" />
          Subscribe
        </Button>
      </div>

      <div className="grid gap-4">
        {channelVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex">
              <div className="relative w-48 h-28 bg-muted overflow-hidden">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                  5:24
                </Badge>
              </div>
              
              <CardContent className="flex-1 p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg line-clamp-2 leading-tight">
                    {video.title}
                  </CardTitle>
                </CardHeader>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(video.viewCount)} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{formatNumber(video.likeCount)} likes</span>
                    </div>
                  </div>
                  <span>{formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 p-0 h-auto text-red-500 hover:text-red-600"
                  onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Watch on YouTube
                </Button>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {channelVideos.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No videos yet</h3>
            <p className="text-muted-foreground">
              Start creating and sharing AI fails to build our YouTube channel!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default YouTubeChannel;
