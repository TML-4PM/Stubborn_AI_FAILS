import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import FailCard from '@/components/FailCard';
import { UserSubmission } from '@/hooks/useSubmissionForm';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading: authLoading, signOut } = useUser();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/');
    }

    if (user) {
      setUsername(user.username || '');
      setBio(user.metadata?.bio || '');
      fetchUserSubmissions();
    }
  }, [user, authLoading, navigate]);

  const fetchUserSubmissions = async () => {
    if (!user?.id) return;

    setIsLoadingSubmissions(true);
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setUserSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your submissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      await updateProfile({ 
        username, 
        metadata: { bio } 
      });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          {authLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{user?.username}'s Profile</h1>
                <p className="text-muted-foreground">
                  Manage your account and view your submissions
                </p>
              </div>
              
              <Tabs defaultValue="submissions" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="submissions">My Submissions</TabsTrigger>
                  <TabsTrigger value="account">Account Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="submissions" className="space-y-6">
                  <h2 className="text-2xl font-semibold">My Submissions</h2>
                  
                  {isLoadingSubmissions ? (
                    <div className="h-40 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : userSubmissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userSubmissions.map((submission) => (
                        <div key={submission.id} className="flex flex-col">
                          <FailCard
                            id={submission.id}
                            image={submission.image_url}
                            author={submission.username}
                            timestamp={new Date(submission.created_at).toISOString()}
                            description={submission.description}
                            name={submission.title}
                            likeCount={submission.likes || 0}
                            status={submission.status}
                          />
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant={submission.status === 'approved' ? 'default' : 'outline'}>
                              {submission.status === 'approved' ? 'Published' : 'Pending Review'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <h3 className="text-xl font-medium mb-2">No submissions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Share your AI fail experiences with the community!
                      </p>
                      <Button 
                        onClick={() => navigate('/submit')}
                        className="px-6"
                      >
                        Submit an AI Fail
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="account" className="space-y-6">
                  <h2 className="text-2xl font-semibold">Account Settings</h2>
                  
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted/50"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your email address cannot be changed.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium">
                        Username
                      </label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bio" className="block text-sm font-medium">
                        Bio
                      </label>
                      <Input
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    
                    <div className="pt-4 flex flex-col space-y-4">
                      <Button 
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
