
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, ExternalLink, Share2, TrendingUp } from 'lucide-react';
import { AIFail } from '@/data/sampleFails';
import { toast } from '@/hooks/use-toast';
import EnhancedShareButton from '@/components/social/EnhancedShareButton';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientText } from '@/components/ui/gradient-text';
import { Badge } from '@/components/ui/badge';

interface FailCardProps {
  id?: string;
  fail?: AIFail;
  image?: string;
  author?: string;
  timestamp?: string;
  description?: string;
  name?: string;
  likeCount?: number;
  status?: string;
  delay?: number;
}

const FailCard: React.FC<FailCardProps> = ({ 
  fail, 
  id,
  image,
  author,
  timestamp,
  description,
  name,
  likeCount,
  status,
  delay = 0 
}) => {
  // Use values from individual props if provided, otherwise use values from the fail object
  const title = name || fail?.title || '';
  const desc = description || fail?.description || '';
  const imageUrl = image || fail?.imageUrl || '';
  const username = author || fail?.username || '';
  const likes = likeCount !== undefined ? likeCount : (fail?.likes || 0);
  const category = fail?.category || status || 'AI Fail';
  
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likes);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLocalLikeCount(prev => prev + 1);
      setShowConfetti(true);
      
      // Confetti animation
      setTimeout(() => setShowConfetti(false), 1000);
      
      toast({
        title: "Liked! ❤️",
        description: `You liked "${title}"`,
      });
    } else {
      setLiked(false);
      setLocalLikeCount(prev => prev - 1);
    }
  };

  const handleQuickShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this hilarious AI fail: ${title}`,
        url: `${window.location.origin}/fail/${id || fail?.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/fail/${id || fail?.id}`);
      toast({
        title: "Link copied! 📋",
        description: "Share this fail with friends!",
      });
    }
  };

  // Determine if this is a "hot" fail
  const isHot = localLikeCount > 100;
  const isTrending = localLikeCount > 500;

  return (
    <GlassCard
      className={`overflow-hidden transition-all duration-700 transform hover:scale-[1.02] ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      } hover:shadow-2xl group relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse" />
        )}
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'} group-hover:brightness-110`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Enhanced overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-all duration-500 ${isHovered ? 'opacity-100' : ''}`}></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-gradient-to-r from-fail to-fail-dark text-white shadow-lg">
            {category}
          </Badge>
          {isTrending && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
          {isHot && !isTrending && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
              🔥 Hot
            </Badge>
          )}
        </div>
        
        {/* Quick action buttons */}
        <div className={`absolute top-3 right-3 flex gap-2 transition-all duration-500 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px]'}`}>
          <button 
            onClick={handleQuickShare}
            className="p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-all duration-300 hover:scale-110"
            aria-label="Quick share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <GradientText gradient="fail" as="h3" className="text-lg font-bold line-clamp-1 mb-2">
          {title}
        </GradientText>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
          {desc}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground flex items-center">
            <div className="w-5 h-5 rounded-full bg-muted overflow-hidden mr-1.5">
              <div className="w-full h-full bg-gradient-to-br from-fail/30 to-fail-dark/30"></div>
            </div>
            By {username}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                liked 
                  ? 'text-red-500 bg-red-50 animate-pulse' 
                  : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
              }`}
              aria-label="Like"
            >
              <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
            </button>
            <EnhancedShareButton 
              failId={id || fail?.id || ''}
              title={title}
              imageUrl={imageUrl}
              category={category}
              description={desc}
            />
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Heart className="w-3 h-3 mr-1" />
            <span className={`${liked ? 'font-bold text-red-500' : ''}`}>
              {localLikeCount.toLocaleString()} likes
            </span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-3 h-3 mr-1" />
            <span>{fail?.comments || Math.floor(Math.random() * 50)} comments</span>
          </div>
        </div>

        {/* Engagement bar */}
        {isHot && (
          <div className="mt-3">
            <div className="bg-muted rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-1000 ${
                  isTrending 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{ width: `${Math.min((localLikeCount / 1000) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {isTrending ? 'Viral territory!' : 'Heating up!'}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default FailCard;
