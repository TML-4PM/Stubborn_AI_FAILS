
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const useContentDiscovery = () => {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [lastDiscovery, setLastDiscovery] = useState<Date | null>(null);

  const triggerDiscovery = async (platform?: string) => {
    setIsDiscovering(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('discover-ai-fails', {
        body: { platform: platform || 'reddit' }
      });

      if (error) throw error;

      setLastDiscovery(new Date());
      toast({
        title: "Content Discovery Started",
        description: `Discovered ${data.discovered} new AI fails from ${data.platform}`,
      });

      return data;
    } catch (error) {
      console.error('Discovery error:', error);
      toast({
        title: "Discovery Failed",
        description: error instanceof Error ? error.message : "Failed to discover new content",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsDiscovering(false);
    }
  };

  const scheduleDiscovery = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('schedule-discovery');
      
      if (error) throw error;

      toast({
        title: "Discovery Scheduled",
        description: "Automated content discovery has been triggered",
      });

      return data;
    } catch (error) {
      console.error('Schedule error:', error);
      toast({
        title: "Schedule Failed", 
        description: error instanceof Error ? error.message : "Failed to schedule discovery",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getPendingContent = async () => {
    try {
      const { data, error } = await supabase
        .from('oopsies')
        .select('*')
        .eq('review_status', 'pending')
        .eq('auto_generated', true)
        .order('confidence_score', { ascending: false })
        .order('viral_score', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching pending content:', error);
      return [];
    }
  };

  const approveContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('oopsies')
        .update({ 
          review_status: 'approved',
          status: 'approved'
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Content Approved",
        description: "The AI fail has been approved and published",
      });
    } catch (error) {
      console.error('Error approving content:', error);
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve content",
        variant: "destructive",
      });
    }
  };

  const rejectContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('oopsies')
        .update({ review_status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Content Rejected",
        description: "The content has been rejected",
      });
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast({
        title: "Rejection Failed",
        description: error instanceof Error ? error.message : "Failed to reject content",
        variant: "destructive",
      });
    }
  };

  return {
    isDiscovering,
    lastDiscovery,
    triggerDiscovery,
    scheduleDiscovery,
    getPendingContent,
    approveContent,
    rejectContent
  };
};
