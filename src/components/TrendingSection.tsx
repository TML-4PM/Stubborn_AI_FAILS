
import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Heart, Eye } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TrendingFail {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  views: number;
  trendingScore: number;
  category: string;
  timeAgo: string;
}

const TrendingSection = () => {
  const navigate = useNavigate();
  const [trendingFails, setTrendingFails] = useState<TrendingFail[]>([]);

  useEffect(() => {
    // Simulate trending content
    const generateTrendingFails = (): TrendingFail[] => [
      {
        id: '1',
        title: 'ChatGPT convinced it\'s actually a penguin',
        imageUrl: '/placeholder.svg',
        likes: 847,
        views: 12500,
        trendingScore: 95,
        category: 'ChatGPT',
        timeAgo: '2h ago'
      },
      {
        id: '2', 
        title: 'DALL-E creates cursed food combinations',
        imageUrl: '/placeholder.svg',
        likes: 623,
        views: 8900,
        trendingScore: 88,
        category: 'DALL-E',
        timeAgo: '4h ago'
      },
      {
        id: '3',
        title: 'AI tries to explain quantum physics using emoji',
        imageUrl: '/placeholder.svg',
        likes: 542,
        views: 7200,
        trendingScore: 82,
        category: 'General AI',
        timeAgo: '6h ago'
      }
    ];

    setTrendingFails(generateTrendingFails());
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-fail" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <Badge className="bg-fail text-white animate-pulse">HOT</Badge>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/gallery')}
            className="hover:bg-fail hover:text-white"
          >
            View All Trending
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {trendingFails.map((fail, index) => (
            <GlassCard 
              key={fail.id}
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate(`/fail/${fail.id}`)}
            >
              <div className="relative">
                <img 
                  src={fail.imageUrl} 
                  alt={fail.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    #{index + 1} Trending
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">
                    {fail.category}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg line-clamp-2 mb-3 group-hover:text-fail transition-colors">
                  {fail.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{fail.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{fail.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{fail.timeAgo}</span>
                  </div>
                </div>
                
                {/* Trending score indicator */}
                <div className="mt-3 bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${fail.trendingScore}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {fail.trendingScore}% trending score
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
