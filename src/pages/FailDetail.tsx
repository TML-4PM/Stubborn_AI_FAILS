
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleFails, AIFail } from '@/data/sampleFails';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Heart, MessageCircle, Share2, Bot, User, Tag, Facebook, Twitter, Linkedin, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Comment {
  id: string;
  username: string;
  date: string;
  text: string;
  avatar?: string;
}

const FailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fail, setFail] = useState<AIFail | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      const foundFail = sampleFails.find(f => f.id === id);
      
      if (foundFail) {
        setFail(foundFail);
        setLikeCount(foundFail.likes);
        
        // Generate some dummy comments
        const dummyComments = [
          {
            id: '1',
            username: 'AIEnthusiast',
            date: '2 days ago',
            text: 'This is hilarious! I had a similar experience with GPT-4 last week.',
          },
          {
            id: '2',
            username: 'TechSceptic',
            date: '1 day ago',
            text: 'And this is why I still prefer human assistance over AI. Too unpredictable!',
          },
        ];
        
        setComments(dummyComments);
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

  const handleShare = (platform?: string) => {
    const shareUrl = `https://aioopsies.com/fail/${id}`;
    const shareText = fail ? `Check out this AI fail: ${fail.title}` : 'Check out this AI fail';
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share this AI fail with your friends",
      });
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting",
        variant: "destructive"
      });
      return;
    }
    
    if (!userName.trim()) {
      toast({
        title: "Username required",
        description: "Please provide a username",
        variant: "destructive"
      });
      return;
    }
    
    // Add new comment
    const newCommentObj: Comment = {
      id: `comment-${Date.now()}`,
      username: userName,
      date: 'Just now',
      text: newComment,
    };
    
    setComments(prev => [newCommentObj, ...prev]);
    setNewComment('');
    toast({
      title: "Comment added!",
      description: "Your comment has been posted",
    });
    setShowCommentForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow bg-gradient-to-b from-background to-muted/50 py-12 px-4">
          <div className="container mx-auto">
            <div className="w-full h-96 rounded-xl bg-muted animate-pulse mb-8"></div>
            <div className="w-3/4 h-10 rounded bg-muted animate-pulse mb-4"></div>
            <div className="w-1/2 h-6 rounded bg-muted animate-pulse mb-8"></div>
            <div className="w-full h-32 rounded bg-muted animate-pulse"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!fail) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="text-4xl font-bold mb-4">Fail Not Found</div>
          <p className="text-muted-foreground mb-8">We couldn't find the AI fail you're looking for.</p>
          <Button onClick={() => navigate('/gallery')}>
            <ArrowLeft className="mr-2" />
            Back to Gallery
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-b from-background to-muted/50 py-12 px-4">
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
                    <div className="text-sm font-medium mb-2 flex items-center">
                      <Tag className="w-3.5 h-3.5 mr-1.5" />
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {fail.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share section */}
                <div className="mb-6">
                  <div className="text-sm font-medium mb-2">Share</div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="p-2 h-9 w-9" 
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="p-2 h-9 w-9" 
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="p-2 h-9 w-9" 
                      onClick={() => handleShare('linkedin')}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="p-2 h-9 w-9" 
                      onClick={() => handleShare()}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowCommentForm(!showCommentForm)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {comments.length} Comments
                  </Button>
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

            {/* Comments section */}
            <div className="md:col-span-3">
              <div className="bg-card border border-border/20 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
                  {!showCommentForm && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCommentForm(true)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Add Comment
                    </Button>
                  )}
                </div>

                {showCommentForm && (
                  <form onSubmit={handleSubmitComment} className="mb-8 bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-4">Add your comment</h3>
                    <div className="space-y-4">
                      <div>
                        <Input
                          placeholder="Your name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="mb-2"
                          required
                        />
                      </div>
                      <div>
                        <Textarea
                          placeholder="Share your thoughts..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[100px]"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => setShowCommentForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-b border-border/10 pb-6 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            {comment.avatar ? (
                              <img 
                                src={comment.avatar} 
                                alt={comment.username} 
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between mb-1">
                              <h4 className="font-medium">{comment.username}</h4>
                              <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                            <p className="text-muted-foreground">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium mb-1">No comments yet</h3>
                    <p className="text-muted-foreground mb-4">Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FailDetail;
