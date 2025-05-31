
import { useState } from 'react';
import { Upload, Heart, Share2, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import RandomFailButton from './RandomFailButton';

const QuickActions = () => {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(42847);

  const handleQuickSubmit = () => {
    navigate('/submit');
    toast({
      title: "Ready to share your AI fail? 📸",
      description: "Upload your hilarious AI moment!",
    });
  };

  const handleCommunityLike = () => {
    setLikeCount(prev => prev + 1);
    toast({
      title: "Thanks for the love! ❤️",
      description: "You just made our community happier!",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Oopsies - Hilarious AI Fails',
        text: 'Check out these funny AI mistakes!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied! 📋",
        description: "Share the laughs with your friends!",
      });
    }
  };

  return (
    <section className="py-8 bg-gradient-to-r from-fail/5 to-purple-500/5">
      <div className="container mx-auto px-4">
        <GlassCard className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Jump Right In!</h3>
            <p className="text-muted-foreground">
              The fastest ways to discover and share AI fails
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Quick Submit */}
            <Button
              onClick={handleQuickSubmit}
              className="bg-fail hover:bg-fail-dark text-white font-semibold py-3 px-6 rounded-full transform transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Upload className="mr-2 h-5 w-5" />
              Quick Submit
            </Button>

            {/* Random Fail */}
            <RandomFailButton />

            {/* Community Like */}
            <Button
              onClick={handleCommunityLike}
              variant="outline"
              className="font-semibold py-3 px-6 rounded-full transform transition-all duration-200 hover:scale-105 border-2 hover:border-red-300 hover:bg-red-50"
            >
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              <span>{likeCount.toLocaleString()} loves</span>
            </Button>

            {/* Share */}
            <Button
              onClick={handleShare}
              variant="outline"
              className="font-semibold py-3 px-6 rounded-full transform transition-all duration-200 hover:scale-105 border-2 hover:border-blue-300 hover:bg-blue-50"
            >
              <Share2 className="mr-2 h-5 w-5 text-blue-500" />
              Share Site
            </Button>

            {/* Hall of Fame */}
            <Button
              onClick={() => navigate('/gallery?filter=featured')}
              variant="outline"
              className="font-semibold py-3 px-6 rounded-full transform transition-all duration-200 hover:scale-105 border-2 hover:border-yellow-300 hover:bg-yellow-50"
            >
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Hall of Fame
            </Button>
          </div>

          {/* Quick stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-fail">12.5K+</div>
              <div className="text-sm text-muted-foreground">AI Fails</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">84K+</div>
              <div className="text-sm text-muted-foreground">Laughs Shared</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">3.2K+</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">247</div>
              <div className="text-sm text-muted-foreground">Online Now</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default QuickActions;
