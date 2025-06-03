
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  Eye, 
  MessageSquare, 
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PendingSubmission {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: string;
  created_at: string;
  user_id: string;
  submission_notes?: string;
  is_featured: boolean;
  profiles?: { username: string } | null;
}

const ContentModerationPanel = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('oopsies')
        .select(`
          id,
          title,
          description,
          image_url,
          status,
          created_at,
          user_id,
          submission_notes,
          is_featured,
          profiles!inner(username)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: PendingSubmission[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        status: item.status,
        created_at: item.created_at,
        user_id: item.user_id,
        submission_notes: item.submission_notes,
        is_featured: item.is_featured,
        profiles: Array.isArray(item.profiles) && item.profiles.length > 0 
          ? item.profiles[0] 
          : null
      }));
      
      setPendingSubmissions(transformedData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, searchQuery]);

  const moderateSubmission = async (submissionId: string, action: 'approved' | 'rejected' | 'featured') => {
    try {
      const submission = pendingSubmissions.find(s => s.id === submissionId);
      if (!submission) return;

      const newStatus = action === 'featured' ? 'approved' : action;
      const isFeatured = action === 'featured';

      // Update submission status
      const { error: updateError } = await supabase
        .from('oopsies')
        .update({
          status: newStatus,
          review_status: newStatus,
          is_featured: isFeatured,
          moderation_notes: moderationNotes,
          processed_at: new Date().toISOString(),
          featured_until: isFeatured ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // Log moderation action
      const { error: logError } = await supabase.rpc('log_moderation_action', {
        oopsie_id: submissionId,
        action,
        reason: moderationNotes,
        previous_status: submission.status,
        new_status: newStatus
      });

      if (logError) console.error('Error logging moderation action:', logError);

      toast({
        title: "Success",
        description: `Submission ${action} successfully`,
      });

      setModerationNotes('');
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error moderating submission:', error);
      toast({
        title: "Error",
        description: "Failed to moderate submission",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, isFeatured: boolean) => {
    if (isFeatured) {
      return <Badge className="bg-yellow-500 text-white"><Star className="h-3 w-3 mr-1" />Featured</Badge>;
    }
    
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Submissions</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filter">Status Filter</Label>
              <select
                id="filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Submissions</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingSubmissions.map((submission) => (
                  <Card key={submission.id} className="overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={submission.image_url} 
                        alt={submission.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm line-clamp-1">{submission.title}</h3>
                        {getStatusBadge(submission.status, submission.is_featured)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {submission.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                        <span>By: {submission.profiles?.username || 'Anonymous'}</span>
                        <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {submission.status === 'pending' && (
                        <div className="space-y-2">
                          {selectedSubmission === submission.id && (
                            <Textarea
                              placeholder="Moderation notes..."
                              value={moderationNotes}
                              onChange={(e) => setModerationNotes(e.target.value)}
                              className="text-xs"
                            />
                          )}
                          <div className="flex gap-1">
                            {selectedSubmission === submission.id ? (
                              <>
                                <Button 
                                  size="sm" 
                                  className="flex-1 text-xs" 
                                  onClick={() => moderateSubmission(submission.id, 'approved')}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1 text-xs"
                                  onClick={() => moderateSubmission(submission.id, 'featured')}
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Feature
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  className="flex-1 text-xs"
                                  onClick={() => moderateSubmission(submission.id, 'rejected')}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full text-xs"
                                onClick={() => setSelectedSubmission(submission.id)}
                              >
                                Moderate
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <div className="space-y-2">
                {pendingSubmissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={submission.image_url} 
                          alt={submission.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{submission.title}</h3>
                            {getStatusBadge(submission.status, submission.is_featured)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {submission.description}
                          </p>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span>By: {submission.profiles?.username || 'Anonymous'}</span>
                            <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {submission.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => moderateSubmission(submission.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => moderateSubmission(submission.id, 'featured')}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => moderateSubmission(submission.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {!isLoading && pendingSubmissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No submissions found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModerationPanel;
