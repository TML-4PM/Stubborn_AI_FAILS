
import { useState, useEffect } from 'react';
import { Heart, Share2, MessageCircle, ExternalLink } from 'lucide-react';
import { AIFail } from '@/data/sampleFails';
import { toast } from '@/hooks/use-toast';

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
  
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likes);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      toast({
        title: "Liked!",
        description: `You liked "${title}"`,
      });
    } else {
      setLiked(false);
      setLocalLikeCount(prev => prev - 1);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Image overlay effects */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
        
        {/* Quick action buttons that appear on hover */}
        <div className={`absolute top-2 right-2 flex gap-1 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-5px]'}`}>
          <button 
            className="p-1.5 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
            aria-label="View details"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Category tag */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 text-[10px] font-medium bg-fail/80 text-white rounded-full">
            {status || fail?.category || 'AI Fail'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
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
        
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <Heart className="w-3 h-3 mr-1" />
            <span>{localLikeCount} likes</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-3 h-3 mr-1" />
            <span>{fail?.comments || 0} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailCard;
