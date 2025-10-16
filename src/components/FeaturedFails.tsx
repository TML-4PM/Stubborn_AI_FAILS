
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Fail {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  likes: number;
  comments: number;
  shares: number;
  viral_score: number;
  source_platform?: string;
}

interface FeaturedFailsProps {
  fails?: Fail[];
  isLoading: boolean;
}

const FeaturedFails = ({ fails, isLoading }: FeaturedFailsProps) => {
  if (isLoading) {
    return (
      <section className="relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-fail/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-fail" />
            <span className="text-fail font-medium">Featured AI Fails</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">The Most Epic AI Mishaps</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our community's favorite AI failures that will make you laugh, cry, and question the future of technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-4"></div>
                <div className="flex gap-4 text-sm">
                  <div className="h-4 bg-muted rounded animate-pulse w-12"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-12"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-12"></div>
                </div>
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-fail/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-fail" />
            <span className="text-fail font-medium">Featured AI Fails</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">No Featured Fails Yet</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Be the first to submit an AI fail and become featured!
          </p>
          <Button asChild className="mt-4">
            <Link to="/submit">Submit Your Fail</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-fail/10 px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-5 w-5 text-fail" />
          <span className="text-fail font-medium">Featured AI Fails</span>
        </div>
        <h2 className="text-3xl font-bold mb-4">The Most Epic AI Mishaps</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our community's favorite AI failures that will make you laugh, cry, and question the future of technology.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fails.map((fail) => (
          <Card key={fail.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-video overflow-hidden">
              <img 
                src={fail.image_url} 
                alt={fail.title}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                  e.currentTarget.onerror = null;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {fail.category}
                </Badge>
                {fail.viral_score > 100 && (
                  <Badge className="bg-fail text-white text-xs">
                    🔥 Viral
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-fail transition-colors">
                {fail.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {fail.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {fail.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {fail.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    {fail.shares}
                  </span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/fail/${fail.id}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button variant="outline" asChild>
          <Link to="/gallery">View All Fails</Link>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedFails;
