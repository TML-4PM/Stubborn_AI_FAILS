
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AuthModal from '@/components/auth/AuthModal';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  avatar_url?: string;
}

interface CommentSectionProps {
  failId: string;
}

const CommentSection = ({ failId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    fetchComments();
  }, [failId]);
  
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles(username, avatar_url)
        `)
        .eq('fail_id', failId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to match our Comment interface
      const transformedComments = (data || []).map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        username: (comment.profiles as any)?.username || 'Anonymous',
        avatar_url: (comment.profiles as any)?.avatar_url
      }));
      
      setComments(transformedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Couldn't load comments",
        description: "There was a problem loading comments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCommentAdded = (newComment: Comment) => {
    setComments([newComment, ...comments]);
  };
  
  const handleAuthModalOpen = () => {
    setShowAuthModal(true);
  };
  
  return (
    <div className="space-y-6 mt-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">Comments</h3>
      </div>
      
      <CommentForm 
        failId={failId}
        onCommentAdded={handleCommentAdded}
        onAuthModalOpen={handleAuthModalOpen}
      />
      
      <CommentList 
        comments={comments}
        isLoading={isLoading}
      />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultView="signIn" 
      />
    </div>
  );
};

export default CommentSection;
