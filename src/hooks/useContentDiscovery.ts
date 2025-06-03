
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DiscoveryError, handleApiError, retryWithBackoff } from '@/utils/errorHandling';

interface DiscoveryMetrics {
  discovered: number;
  stored: number;
  platform: string;
  timestamp: string;
}

interface PendingContent {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  source_url: string;
  source_platform: string;
  confidence_score: number;
  viral_score: number;
  discovery_date: string;
  category: string;
  keywords?: string[];
}

export const useContentDiscovery = () => {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [lastDiscovery, setLastDiscovery] = useState<Date | null>(null);

  const triggerDiscovery = async (platform: string = 'reddit'): Promise<DiscoveryMetrics | null> => {
    setIsDiscovering(true);
    
    try {
      console.log(`Starting discovery for platform: ${platform}`);
      
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase.functions.invoke('discover-ai-fails', {
          body: { platform }
        });

        if (error) {
          throw handleApiError(error, 'discovery-function');
        }

        if (!data || !data.success) {
          throw new DiscoveryError(
            data?.error || 'Discovery function returned unsuccessful result',
            'DISCOVERY_FAILED',
            platform
          );
        }

        return data;
      }, 3, 2000);

      setLastDiscovery(new Date());
      
      toast({
        title: "Content Discovery Completed",
        description: `Discovered ${result.discovered} items, stored ${result.stored} new AI fails from ${result.platform}`,
      });

      return {
        discovered: result.discovered || 0,
        stored: result.stored || 0,
        platform: result.platform || platform,
        timestamp: result.timestamp || new Date().toISOString()
      };

    } catch (error) {
      console.error('Discovery error:', error);
      
      const errorMessage = error instanceof DiscoveryError 
        ? error.message 
        : "Failed to discover new content";
      
      toast({
        title: "Discovery Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsDiscovering(false);
    }
  };

  const scheduleDiscovery = async (): Promise<any> => {
    try {
      console.log('Triggering scheduled discovery...');
      
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase.functions.invoke('schedule-discovery');
        
        if (error) {
          throw handleApiError(error, 'schedule-function');
        }

        return data;
      });

      toast({
        title: "Discovery Scheduled",
        description: "Automated content discovery has been triggered for multiple platforms",
      });

      return result;
    } catch (error) {
      console.error('Schedule error:', error);
      
      const errorMessage = error instanceof DiscoveryError 
        ? error.message 
        : "Failed to schedule discovery";
      
      toast({
        title: "Schedule Failed", 
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const getPendingContent = async (): Promise<PendingContent[]> => {
    try {
      const { data, error } = await supabase
        .from('oopsies')
        .select(`
          id, title, description, image_url, source_url, source_platform,
          confidence_score, viral_score, discovery_date, category
        `)
        .eq('review_status', 'pending')
        .eq('auto_generated', true)
        .order('confidence_score', { ascending: false })
        .order('viral_score', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching pending content:', error);
        throw new DiscoveryError(
          'Failed to fetch pending content',
          'DATABASE_ERROR',
          undefined,
          error
        );
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPendingContent:', error);
      
      const errorMessage = error instanceof DiscoveryError 
        ? error.message 
        : "Unknown error occurred";
      
      toast({
        title: "Failed to Load Pending Content",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    }
  };

  const approveContent = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('oopsies')
        .update({ 
          review_status: 'approved',
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error approving content:', error);
        throw new DiscoveryError(
          'Failed to approve content',
          'DATABASE_ERROR',
          undefined,
          error
        );
      }

      toast({
        title: "Content Approved",
        description: "The AI fail has been approved and published",
      });
    } catch (error) {
      console.error('Error in approveContent:', error);
      
      const errorMessage = error instanceof DiscoveryError 
        ? error.message 
        : "Failed to approve content";
      
      toast({
        title: "Approval Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const rejectContent = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('oopsies')
        .update({ 
          review_status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error rejecting content:', error);
        throw new DiscoveryError(
          'Failed to reject content',
          'DATABASE_ERROR',
          undefined,
          error
        );
      }

      toast({
        title: "Content Rejected",
        description: "The content has been rejected and will not be published",
      });
    } catch (error) {
      console.error('Error in rejectContent:', error);
      
      const errorMessage = error instanceof DiscoveryError 
        ? error.message 
        : "Failed to reject content";
      
      toast({
        title: "Rejection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const getDiscoveryMetrics = async (): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('oopsies')
        .select('auto_generated, review_status, source_platform, confidence_score, created_at')
        .eq('auto_generated', true);

      if (error) {
        throw new DiscoveryError(
          'Failed to fetch discovery metrics',
          'DATABASE_ERROR',
          undefined,
          error
        );
      }

      const metrics = {
        totalDiscovered: data?.length || 0,
        approvedCount: data?.filter(item => item.review_status === 'approved').length || 0,
        pendingCount: data?.filter(item => item.review_status === 'pending').length || 0,
        rejectedCount: data?.filter(item => item.review_status === 'rejected').length || 0,
        averageConfidence: data?.length ? 
          data.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / data.length : 0,
        topSources: getTopSources(data || [])
      };

      return metrics;
    } catch (error) {
      console.error('Error getting discovery metrics:', error);
      return {
        totalDiscovered: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        averageConfidence: 0,
        topSources: []
      };
    }
  };

  const getTopSources = (data: any[]): Array<{ platform: string; count: number }> => {
    const sourceCounts = data.reduce((acc, item) => {
      const platform = item.source_platform || 'unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceCounts)
      .map(([platform, count]) => ({ platform, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return {
    isDiscovering,
    lastDiscovery,
    triggerDiscovery,
    scheduleDiscovery,
    getPendingContent,
    approveContent,
    rejectContent,
    getDiscoveryMetrics
  };
};
