
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FailCard } from '@/components/FailCard';
import { Loader2, Settings, Camera } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import NotFound from './NotFound';

interface UserSubmission {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
  username: string;
  status: string;
  likes: number;
}

const Profile = () => {
  const { user, isLoading, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    if (user) {
      setNewUsername(user.username || '');
      fetchUserSubmissions();
    }
  }, [user]);
  
  const fetchUserSubmissions = async () => {
    if (!user) return;
    
    setIsSubmissionsLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match the FailCard component props
      const transformedData = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.image_url,
        username: item.username || "Anonymous", 
        date: new Date(item.created_at).toLocaleDateString(),
        likes: item.likes || 0,
        category: "general",
        tags: [],
        aiModel: "unknown",
        featured: false // Add the missing property
      }));
      
      setSubmissions(transformedData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsSubmissionsLoading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user || !newUsername.trim()) return;
    
    await updateProfile({ username: newUsername });
    setIsEditing(false);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Profile Access</CardTitle>
            <CardDescription>You need to sign in to view your profile.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setShowAuthModal(true)}>Sign In</Button>
          </CardFooter>
        </Card>
        
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultView="signIn" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-10">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="max-w-[250px]"
                      placeholder="Username"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveProfile}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setIsEditing(false);
                        setNewUsername(user.username || '');
                      }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{user.username || 'Anonymous User'}</h2>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="mt-4 md:mt-0">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
            <TabsTrigger value="liked">Liked Posts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions">
            {isSubmissionsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((submission) => (
                  <FailCard
                    key={submission.id}
                    id={submission.id}
                    title={submission.title}
                    description={submission.description || ''}
                    imageUrl={submission.imageUrl}
                    username={submission.username}
                    date={submission.date}
                    likes={submission.likes}
                    category={submission.category}
                    tags={submission.tags}
                    aiModel={submission.aiModel}
                    featured={submission.featured}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">You haven't submitted any AI fails yet.</p>
                <Button href="/submit">Submit Your First Fail</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="liked">
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">Liked posts will appear here.</p>
              <p className="text-sm text-muted-foreground">This feature is coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
