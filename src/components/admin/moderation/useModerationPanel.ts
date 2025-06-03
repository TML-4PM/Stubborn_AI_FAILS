
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PendingSubmission } from './types';

export const useModerationPanel = () => {
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

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, searchQuery]);

  return {
    pendingSubmissions,
    isLoading,
    selectedSubmission,
    setSelectedSubmission,
    moderationNotes,
    setModerationNotes,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    moderateSubmission
  };
};
