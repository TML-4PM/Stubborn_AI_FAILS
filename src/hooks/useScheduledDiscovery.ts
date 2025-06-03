
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ScheduleConfig {
  enabled: boolean;
  intervalHours: number;
  nextRun?: Date;
}

export const useScheduledDiscovery = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [nextRun, setNextRun] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleConfig>({
    enabled: false,
    intervalHours: 6,
    nextRun: undefined
  });
  const [timeUntilNextRun, setTimeUntilNextRun] = useState(0);

  useEffect(() => {
    fetchDiscoveryStatus();
    const interval = setInterval(() => {
      if (schedule.nextRun) {
        const now = new Date().getTime();
        const nextRunTime = new Date(schedule.nextRun).getTime();
        setTimeUntilNextRun(Math.max(0, nextRunTime - now));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule.nextRun]);

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
        return;
      }

      setIsRunning(data?.is_running || false);
      setLastRun(data?.last_run || null);
      setNextRun(data?.next_run || null);
      
      setSchedule(prev => ({
        ...prev,
        enabled: !!data?.next_run,
        nextRun: data?.next_run ? new Date(data.next_run) : undefined
      }));
    } catch (error) {
      console.error('Error fetching discovery status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSchedule = async (updates: Partial<ScheduleConfig>) => {
    const newSchedule = { ...schedule, ...updates };
    setSchedule(newSchedule);

    const nextRunTime = newSchedule.enabled 
      ? new Date(Date.now() + newSchedule.intervalHours * 60 * 60 * 1000).toISOString()
      : null;

    try {
      const { error } = await supabase
        .from('scheduled_tasks')
        .update({
          next_run: nextRunTime,
          updated_at: new Date().toISOString()
        })
        .eq('task_name', 'ai_fail_discovery');

      if (error) throw error;
      
      setNextRun(nextRunTime);
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast({
        title: 'Error updating schedule',
        description: 'Failed to update discovery schedule',
        variant: 'destructive',
      });
    }
  };

  const runDiscovery = async () => {
    setIsRunning(true);
    try {
      const { error } = await supabase.functions.invoke('schedule-discovery');

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

      // Update the last run time
      await supabase
        .from('scheduled_tasks')
        .update({
          is_running: true,
          last_run: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('task_name', 'ai_fail_discovery');

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

  const startDiscovery = async () => {
    await runDiscovery();
  };

  const stopDiscovery = async () => {
    setIsRunning(false);
    try {
      await supabase
        .from('scheduled_tasks')
        .update({
          is_running: false,
          updated_at: new Date().toISOString()
        })
        .eq('task_name', 'ai_fail_discovery');

      toast({
        title: 'Discovery stopped',
        description: 'AI fail discovery has been stopped.',
      });
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
    schedule,
    timeUntilNextRun,
    updateSchedule,
    runDiscovery,
    startDiscovery,
    stopDiscovery,
    fetchDiscoveryStatus,
  };
};
