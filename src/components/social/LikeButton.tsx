
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AuthModal from '@/components/auth/AuthModal';

interface LikeButtonProps {
  failId: string;
  initialLikes: number;
}

const LikeButton = ({ failId, initialLikes }: LikeButtonProps) => {
  const { user } = useUser();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    if (user) {
      checkIfLiked();
    }
  }, [user, failId]);
  
  const checkIfLiked = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('fail_id', failId)
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking like status:', error);
        return;
      }
      
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };
  
  const handleLike = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setIsLoading(true);
    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('fail_id', failId)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Update submissions table likes count
        await supabase.rpc('decrement_likes', { fail_id: failId });
        
        setIsLiked(false);
        setLikes(prevLikes => Math.max(0, prevLikes - 1));
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            fail_id: failId,
            user_id: user.id,
            created_at: new Date().toISOString()
          });
          
        if (error) throw error;
        
        // Update submissions table likes count
        await supabase.rpc('increment_likes', { fail_id: failId });
        
        setIsLiked(true);
        setLikes(prevLikes => prevLikes + 1);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Couldn't update like",
        description: "There was a problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Button
        onClick={handleLike}
        variant="ghost"
        size="sm"
        disabled={isLoading}
        className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
      >
        <Heart 
          className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
        />
        <span>{likes}</span>
      </Button>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultView="signIn" 
      />
    </>
  );
};

export default LikeButton;
