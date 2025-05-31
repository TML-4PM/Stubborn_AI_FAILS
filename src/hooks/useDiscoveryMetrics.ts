
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface DiscoveryMetrics {
  totalDiscovered: number;
  approvedContent: number;
  rejectedContent: number;
  pendingReview: number;
  averageConfidenceScore: number;
  lastDiscoveryRun?: Date;
  successRate: number;
}

export const useDiscoveryMetrics = () => {
  const [metrics, setMetrics] = useState<DiscoveryMetrics>({
    totalDiscovered: 0,
    approvedContent: 0,
    rejectedContent: 0,
    pendingReview: 0,
    averageConfidenceScore: 0,
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);

      // Get basic counts
      const { data: totalData } = await supabase
        .from('oopsies')
        .select('id', { count: 'exact', head: true })
        .eq('auto_generated', true);

      const { data: approvedData } = await supabase
        .from('oopsies')
        .select('id', { count: 'exact', head: true })
        .eq('auto_generated', true)
        .eq('review_status', 'approved');

      const { data: rejectedData } = await supabase
        .from('oopsies')
        .select('id', { count: 'exact', head: true })
        .eq('auto_generated', true)
        .eq('review_status', 'rejected');

      const { data: pendingData } = await supabase
        .from('oopsies')
        .select('id', { count: 'exact', head: true })
        .eq('auto_generated', true)
        .eq('review_status', 'pending');

      // Get average confidence score
      const { data: confidenceData } = await supabase
        .from('oopsies')
        .select('confidence_score')
        .eq('auto_generated', true)
        .not('confidence_score', 'is', null);

      // Get last discovery run
      const { data: lastRunData } = await supabase
        .from('oopsies')
        .select('discovery_date')
        .eq('auto_generated', true)
        .order('discovery_date', { ascending: false })
        .limit(1);

      const totalDiscovered = totalData?.length || 0;
      const approved = approvedData?.length || 0;
      const rejected = rejectedData?.length || 0;
      const pending = pendingData?.length || 0;

      const avgConfidence = confidenceData?.length 
        ? confidenceData.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / confidenceData.length
        : 0;

      const successRate = totalDiscovered > 0 ? (approved / totalDiscovered) * 100 : 0;

      setMetrics({
        totalDiscovered,
        approvedContent: approved,
        rejectedContent: rejected,
        pendingReview: pending,
        averageConfidenceScore: avgConfidence,
        lastDiscoveryRun: lastRunData?.[0]?.discovery_date ? new Date(lastRunData[0].discovery_date) : undefined,
        successRate,
      });
    } catch (error) {
      console.error('Error fetching discovery metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    isLoading,
    refreshMetrics: fetchMetrics,
  };
};
