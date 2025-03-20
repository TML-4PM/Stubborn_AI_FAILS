
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, Tag, Bot, Loader2 } from 'lucide-react';
import CommentSection from '@/components/social/CommentSection';
import LikeButton from '@/components/social/LikeButton';
import ShareButton from '@/components/social/ShareButton';
import { formatDistanceToNow } from 'date-fns';

interface FailDetail {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  username: string;
  created_at: string;
  likes: number;
  category?: string;
  tags?: string[];
  ai_model?: string;
  status: string;
}

const FailDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [fail, setFail] = useState<FailDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!id) {
          throw new Error('Fail ID is required');
        }
        
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', id)
          .eq('status', 'approved')
          .single();
          
        if (error) throw error;
        if (!data) throw new Error('Fail not found');
        
        setFail(data);
      } catch (err) {
        console.error('Error fetching fail:', err);
        setError('Failed to load this AI fail. It may not exist or has been removed.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFail();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !fail) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Oops, something went wrong</h1>
          <p className="text-muted-foreground mb-6">{error || 'This AI fail could not be found.'}</p>
          <Button asChild>
            <Link to="/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link to="/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={fail.image_url} 
                    alt={fail.title} 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
              
              <div className="lg:w-1/3 flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{fail.title}</h1>
                
                {fail.description && (
                  <p className="text-muted-foreground mb-6">{fail.description}</p>
                )}
                
                <div className="space-y-4 mt-auto">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    <span>Posted by {fail.username || 'Anonymous'}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDistanceToNow(new Date(fail.created_at), { addSuffix: true })}</span>
                  </div>
                  
                  {fail.ai_model && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Bot className="h-4 w-4 mr-2" />
                      <span>AI Model: {fail.ai_model}</span>
                    </div>
                  )}
                  
                  {fail.tags && fail.tags.length > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Tag className="h-4 w-4 mr-2" />
                      <span>{fail.tags.join(', ')}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex items-center space-x-2">
                    <LikeButton failId={fail.id} initialLikes={fail.likes || 0} />
                    <ShareButton failId={fail.id} title={fail.title} />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <CommentSection failId={fail.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FailDetail;
