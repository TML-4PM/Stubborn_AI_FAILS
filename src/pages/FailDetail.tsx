import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommentSection from '@/components/social/CommentSection';
import LikeButton from '@/components/social/LikeButton';
import ShareButton from '@/components/social/ShareButton';

interface Fail {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  likes: number;
  comments: number;
  shares: number;
  viral_score: number;
  created_at: string;
  status: string;
  user_id: string;
  source_platform?: string;
}

const FailDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [fail, setFail] = useState<Fail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    if (id) {
      fetchFail(id);
      incrementViewCount(id);
    }
  }, [id]);

  const fetchFail = async (failId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('oopsies')
        .select('*')
        .eq('id', failId)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setFail(data);
      } else {
        setError('Fail not found');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const incrementViewCount = async (failId: string) => {
    try {
      // Use the increment_likes function as a workaround, we'll need to create an increment_views function later
      const { error } = await supabase.rpc('increment_likes', {
        fail_id: failId,
      });

      if (error) {
        console.error('Error incrementing view count:', error);
      } else {
        setViews((prevViews) => prevViews + 1);
      }
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p>Loading fail details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !fail) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p>Error: {error || 'Fail not found'}</p>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="relative rounded-lg overflow-hidden shadow-md">
            <img
              src={fail.image_url}
              alt={fail.title}
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge className="uppercase text-xs">{fail.category}</Badge>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold mb-2">{fail.title}</h1>
            <p className="text-muted-foreground mb-4">{fail.description}</p>

            <div className="flex items-center space-x-4 mb-4">
              <span className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {formatDate(fail.created_at)}
              </span>
              <span className="flex items-center text-sm text-muted-foreground">
                <Eye className="mr-2 h-4 w-4" />
                {views} views
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <LikeButton failId={fail.id} initialLikes={fail.likes} />
              <ShareButton failId={fail.id} title={fail.title} />
            </div>

            <CommentSection failId={fail.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FailDetail;
