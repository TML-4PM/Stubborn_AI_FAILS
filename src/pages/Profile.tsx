
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, Settings, Grid3X3, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { AIFail } from '@/data/sampleFails';
import FailCard from '@/components/FailCard';

const Profile = () => {
  const { user, isLoading, signOut, updateProfile } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState<AIFail[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);

  useEffect(() => {
    // Redirect to homepage if not logged in
    if (!isLoading && !user) {
      navigate('/');
    }
    
    // Set initial values
    if (user) {
      setUsername(user.username || '');
      setAvatarUrl(user.avatar_url);
      
      // Load user submissions
      const fetchUserSubmissions = async () => {
        setIsLoadingSubmissions(true);
        try {
          const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          // Convert to AIFail format
          const formattedSubmissions: AIFail[] = data.map(submission => ({
            id: submission.id,
            title: submission.title,
            description: submission.description,
            imageUrl: submission.image_url,
            username: user.username || 'Anonymous',
            date: new Date(submission.created_at).toLocaleDateString(),
            likes: submission.likes || 0,
            category: submission.category || undefined,
            tags: submission.tags || [],
            aiModel: submission.ai_model || undefined
          }));
          
          setUserSubmissions(formattedSubmissions);
        } catch (error) {
          console.error('Error fetching submissions:', error);
          toast({
            title: "Error loading submissions",
            description: "We couldn't load your submissions. Please try again later.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingSubmissions(false);
        }
      };
      
      fetchUserSubmissions();
    }
  }, [user, isLoading, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({ username, avatar_url: avatarUrl });
    } catch (error) {
      // Error handling is done in the updateProfile function
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to homepage
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-xl p-6 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.username || 'User'} />
                  <AvatarFallback className="text-2xl">
                    {user.username ? user.username[0].toUpperCase() : <User />}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-grow text-center md:text-left">
                  <h1 className="text-2xl font-bold">
                    {user.username || 'Anonymous User'}
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    {user.email}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="submissions">
              <TabsList className="mb-6">
                <TabsTrigger value="submissions">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  My Submissions
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="submissions">
                <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
                
                {isLoadingSubmissions ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : userSubmissions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {userSubmissions.map(fail => (
                      <FailCard key={fail.id} fail={fail} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                    <Grid3X3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No submissions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't submitted any AI fails yet.
                    </p>
                    <Button onClick={() => navigate('/submit')}>
                      Submit Your First Fail
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                  <Separator className="mb-6" />
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
