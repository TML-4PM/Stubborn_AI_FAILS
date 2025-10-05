import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSocialActions = (failId: string, initialLikes: number = 0) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLike = () => {
    // Toggle like state
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => isLiked ? Math.max(0, prev - 1) : prev + 1);
    
    // TODO: Integrate with backend when tables are created
    toast({
      title: isLiked ? 'Unliked' : 'Liked!',
      description: isLiked ? 'Removed from your likes' : 'Added to your likes',
    });
  };

  const handleBookmark = () => {
    // Toggle bookmark state
    setIsBookmarked((prev) => !prev);
    
    // TODO: Integrate with backend when tables are created
    toast({
      title: isBookmarked ? 'Removed from bookmarks' : 'Bookmarked!',
      description: isBookmarked ? 'Removed from your collection' : 'Saved to your collection',
    });
  };

  return {
    isLiked,
    isBookmarked,
    likesCount,
    handleLike,
    handleBookmark,
    setLikesCount,
  };
};
