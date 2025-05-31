import { useState, useEffect } from 'react';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { AIFail } from '@/data/sampleFails';
import { toast } from '@/hooks/use-toast';
import EnhancedShareButton from '@/components/social/EnhancedShareButton';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientText } from '@/components/ui/gradient-text';

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

  return (
    <GlassCard
      className={`overflow-hidden transition-all duration-700 transform hover:scale-[1.02] ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      } hover:shadow-2xl group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
        
        {/* Floating action buttons */}
        <div className={`absolute top-3 right-3 flex gap-2 transition-all duration-500 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px]'}`}>
          <button 
            className="p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-all duration-300 hover:scale-110"
            aria-label="View details"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        
        {/* Enhanced category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-fail to-fail-dark text-white rounded-full shadow-lg">
            {category}
          </span>
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
              className={`p-2 rounded-full transition-colors ${
                liked 
                  ? 'text-red-500 bg-red-50' 
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
            <span>{localLikeCount} likes</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="w-3 h-3 mr-1" />
            <span>{fail?.comments || 0} comments</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default FailCard;
