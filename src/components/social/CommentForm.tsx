import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface CommentFormProps {
  failId: string;
  onCommentAdded: (comment: any) => void;
  onAuthModalOpen: () => void;
}

const CommentForm = ({ failId, onCommentAdded, onAuthModalOpen }: CommentFormProps) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  
  const handleSubmit = async () => {
    if (!user) {
      onAuthModalOpen();
      return;
    }
    
    if (!commentText.trim()) {
      toast({
        title: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          fail_id: failId,
          content: commentText,
          user_id: user.id
        })
        .select('*, profiles(username, avatar_url)')
        .single();
        
      if (error) throw error;
      
      // Transform the comment data to match the expected format
      const transformedComment = {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        username: comment.profiles?.username || 'Anonymous',
        avatar_url: comment.profiles?.avatar_url
      };
      
      onCommentAdded(transformedComment);
      setCommentText('');
      toast({
        title: "Comment added",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Couldn't submit comment",
        description: "There was a problem submitting your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <Textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add your comment..."
        rows={3}
        disabled={isSubmitting}
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Send className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              Post Comment
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
