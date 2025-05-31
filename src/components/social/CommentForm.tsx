
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  avatar_url?: string;
}

interface CommentFormProps {
  failId: string;
  onCommentAdded: (comment: Comment) => void;
  onAuthModalOpen: () => void;
}

const CommentForm = ({ failId, onCommentAdded, onAuthModalOpen }: CommentFormProps) => {
  const { user } = useUser();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      onAuthModalOpen();
      return;
    }
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          fail_id: failId,
          user_id: user.id,
          content: newComment.trim(),
          created_at: new Date().toISOString()
        })
        .select('*, profiles(username, avatar_url)')
        .single();
        
      if (error) throw error;
      
      // Add the new comment to the list
      const newCommentObj: Comment = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        user_id: data.user_id,
        username: data.profiles?.username || user.username || 'Anonymous',
        avatar_url: data.profiles?.avatar_url || user.avatar_url
      };
      
      onCommentAdded(newCommentObj);
      setNewComment('');
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Couldn't add comment",
        description: "There was a problem adding your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmitComment} className="space-y-4">
      <Textarea
        placeholder={user ? "Add a comment..." : "Sign in to comment"}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="min-h-[100px]"
        disabled={!user || isSubmitting}
      />
      <div className="flex justify-end">
        {user ? (
          <Button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Comment'
            )}
          </Button>
        ) : (
          <Button type="button" onClick={onAuthModalOpen}>
            Sign In to Comment
          </Button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
