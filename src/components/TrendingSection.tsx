
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Heart, MessageCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Fail {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  likes: number;
  comments: number;
  viral_score: number;
  created_at: string;
}

interface TrendingSectionProps {
  fails?: Fail[];
  isLoading?: boolean;
}

const TrendingSection = ({ fails, isLoading }: TrendingSectionProps) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  if (isLoading) {
    return (
      <section className="relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Trending Now</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Rising AI Disasters</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fresh fails that are gaining traction in our community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse"></div>
              <CardContent className="p-3">
                <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!fails || fails.length === 0) {
    return (
      <section className="relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Trending Now</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">No Trending Fails</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Submit more AI fails to see trending content!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-primary font-medium">Trending Now</span>
        </div>
        <h2 className="text-3xl font-bold mb-4">Rising AI Disasters</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Fresh fails that are gaining traction in our community.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fails.map((fail, index) => (
          <Card key={fail.id} className="group overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="aspect-square overflow-hidden relative">
              <img 
                src={fail.image_url} 
                alt={fail.title}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                  e.currentTarget.onerror = null;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 flex gap-1">
                <Badge className="bg-primary text-white text-xs">
                  #{index + 1}
                </Badge>
                {fail.viral_score > 80 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    🔥 Hot
                  </Badge>
                )}
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {fail.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {fail.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {fail.comments}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(fail.created_at)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button variant="outline" asChild>
          <Link to="/gallery">Explore More Trends</Link>
        </Button>
      </div>
    </section>
  );
};

export default TrendingSection;
