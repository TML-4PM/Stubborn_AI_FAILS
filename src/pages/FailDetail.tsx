
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleFails, AIFail } from '@/data/sampleFails';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, MessageCircle, Share2, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fail, setFail] = useState<AIFail | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const foundFail = sampleFails.find(f => f.id === id);
      
      if (foundFail) {
        setFail(foundFail);
        setLikeCount(foundFail.likes);
      }
      
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  const handleLike = () => {
    if (!isLiked) {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      toast({
        title: "Added like!",
        description: "You liked this AI fail",
      });
    } else {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
      toast({
        title: "Removed like",
        description: "You unliked this AI fail",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://aioopsies.com/fail/${id}`);
    toast({
      title: "Link copied!",
      description: "Share this AI fail with your friends",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="w-full h-96 rounded-xl bg-muted animate-pulse mb-8"></div>
          <div className="w-3/4 h-10 rounded bg-muted animate-pulse mb-4"></div>
          <div className="w-1/2 h-6 rounded bg-muted animate-pulse mb-8"></div>
          <div className="w-full h-32 rounded bg-muted animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!fail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-4xl font-bold mb-4">Fail Not Found</div>
        <p className="text-muted-foreground mb-8">We couldn't find the AI fail you're looking for.</p>
        <Button onClick={() => navigate('/gallery')}>
          <ArrowLeft className="mr-2" />
          Back to Gallery
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation */}
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main image */}
          <div className="md:col-span-2 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-fail/50 to-primary/50 opacity-30 blur-xl rounded-xl group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border/20 bg-card shadow-lg">
              <img 
                src={fail.imageUrl} 
                alt={fail.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {fail.aiModel && (
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                  <Bot className="inline-block w-3.5 h-3.5 mr-1.5 align-text-bottom" />
                  {fail.aiModel}
                </div>
              )}
            </div>
          </div>

          {/* Metadata column */}
          <div className="md:col-span-1">
            <div className="bg-card border border-border/20 rounded-xl p-6 shadow-lg h-full flex flex-col">
              <div>
                {fail.category && (
                  <div className="inline-block px-3 py-1 bg-muted text-xs font-medium rounded-full mb-3">
                    {fail.category}
                  </div>
                )}
                <h1 className="text-2xl font-bold mb-2">{fail.title}</h1>
                <div className="flex items-center text-muted-foreground text-sm mb-4">
                  <span className="font-medium text-foreground">@{fail.username}</span>
                  <span className="mx-2">•</span>
                  <span>{fail.date}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 flex-grow">{fail.description}</p>

              {fail.tags && (
                <div className="mb-6">
                  <div className="text-sm font-medium mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {fail.tags.map(tag => (
                      <div key={tag} className="px-2.5 py-1 bg-muted rounded-full text-xs">
                        #{tag}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                <Button 
                  variant={isLiked ? "default" : "outline"} 
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? "bg-fail hover:bg-fail-dark" : ""}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
                  {likeCount}
                </Button>
                <div className="flex gap-2">
                  {fail.comments && (
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4" />
                      {fail.comments}
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Description section (full width) */}
          <div className="md:col-span-3 bg-card border border-border/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">The Backstory</h2>
            <p className="text-muted-foreground mb-6">
              {fail.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
            </p>
            <p className="text-muted-foreground">
              Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailDetail;
