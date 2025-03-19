
import { useState, useEffect } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { AIFail } from '@/data/sampleFails';
import { toast } from '@/hooks/use-toast';

interface FailCardProps {
  fail: AIFail;
  delay?: number;
}

const FailCard: React.FC<FailCardProps> = ({ fail, delay = 0 }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(fail.likes);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      toast({
        title: "Liked!",
        description: `You liked "${fail.title}"`,
      });
    } else {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  const handleShare = () => {
    // In a real app, this would use the Web Share API or create a shareable link
    toast({
      title: "Shared!",
      description: "This AI fail has been copied to your clipboard.",
    });
  };

  return (
    <div
      className={`rounded-xl overflow-hidden bg-card border shadow-sm transition-all duration-500 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      } hover:shadow-md hover:translate-y-[-2px]`}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={fail.imageUrl}
          alt={fail.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-1">{fail.title}</h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
          {fail.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            By {fail.username}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                liked 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
              }`}
              aria-label="Like"
            >
              <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground flex items-center">
          <Heart className="w-3 h-3 mr-1" />
          <span>{likeCount} likes</span>
        </div>
      </div>
    </div>
  );
};

export default FailCard;
