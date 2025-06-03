import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useScheduledDiscovery = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [nextRun, setNextRun] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDiscoveryStatus();
  }, []);

  const fetchDiscoveryStatus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('scheduled_tasks')
        .select('*')
        .eq('task_name', 'ai_fail_discovery')
        .single();

      if (error) {
        console.error('Error fetching discovery status:', error);
        toast({
          title: 'Error fetching discovery status',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setIsRunning(data?.is_running || false);
      setLastRun(data?.last_run || null);
      setNextRun(data?.next_run || null);
    } catch (error) {
      console.error('Error fetching discovery status:', error);
      toast({
        title: 'Error fetching discovery status',
        description: 'Failed to fetch discovery status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startDiscovery = async () => {
    setIsRunning(true);
    try {
      const { error } = await supabase.functions.invoke('start-ai-discovery');

      if (error) {
        console.error('Error starting discovery:', error);
        toast({
          title: 'Error starting discovery',
          description: error.message,
          variant: 'destructive',
        });
        setIsRunning(false);
        return;
      }

      toast({
        title: 'Discovery started',
        description: 'AI fail discovery has been initiated.',
      });

      // Optimistically update the state
      setIsRunning(true);
      setNextRun('Starting...');

      // Refresh status after a delay to allow the function to update the database
      setTimeout(() => {
        fetchDiscoveryStatus();
      }, 5000);
    } catch (error) {
      console.error('Error starting discovery:', error);
      toast({
        title: 'Error starting discovery',
        description: 'Failed to start AI fail discovery. Please try again.',
        variant: 'destructive',
      });
      setIsRunning(false);
    }
  };

  const stopDiscovery = async () => {
    setIsRunning(false);
    try {
      const { error } = await supabase.functions.invoke('stop-ai-discovery');

      if (error) {
        console.error('Error stopping discovery:', error);
        toast({
          title: 'Error stopping discovery',
          description: error.message,
          variant: 'destructive',
        });
        setIsRunning(true);
        return;
      }

      toast({
        title: 'Discovery stopped',
        description: 'AI fail discovery has been stopped.',
      });

      // Optimistically update the state
      setIsRunning(false);
      setNextRun(null);

      // Refresh status after a delay to allow the function to update the database
      setTimeout(() => {
        fetchDiscoveryStatus();
      }, 5000);
    } catch (error) {
      console.error('Error stopping discovery:', error);
      toast({
        title: 'Error stopping discovery',
        description: 'Failed to stop AI fail discovery. Please try again.',
        variant: 'destructive',
      });
      setIsRunning(true);
    }
  };

  return {
    isRunning,
    lastRun,
    nextRun,
    isLoading,
    startDiscovery,
    stopDiscovery,
    fetchDiscoveryStatus,
  };
};
