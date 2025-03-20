
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AuthModal from '@/components/auth/AuthModal';
import { formatDistanceToNow } from 'date-fns';

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
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    fetchComments();
  }, [failId]);
  
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar_url)')
        .eq('fail_id', failId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to match our Comment interface
      const transformedComments = data.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        username: comment.profiles?.username || 'Anonymous',
        avatar_url: comment.profiles?.avatar_url
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
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
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
      
      setComments([newCommentObj, ...comments]);
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
    <div className="space-y-6 mt-8">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">Comments</h3>
      </div>
      
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
            <Button type="button" onClick={() => setShowAuthModal(true)}>
              Sign In to Comment
            </Button>
          )}
        </div>
      </form>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.avatar_url || undefined} />
                <AvatarFallback>
                  {comment.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{comment.username}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultView="signIn" 
      />
    </div>
  );
};

export default CommentSection;
