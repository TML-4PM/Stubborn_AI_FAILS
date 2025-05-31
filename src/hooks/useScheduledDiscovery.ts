
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface ScheduleConfig {
  enabled: boolean;
  intervalHours: number;
  lastRun?: Date;
  nextRun?: Date;
}

export const useScheduledDiscovery = () => {
  const [schedule, setSchedule] = useState<ScheduleConfig>({
    enabled: false,
    intervalHours: 6,
  });
  const [isRunning, setIsRunning] = useState(false);

  const calculateNextRun = useCallback((lastRun: Date, intervalHours: number) => {
    return new Date(lastRun.getTime() + intervalHours * 60 * 60 * 1000);
  }, []);

  const runDiscovery = useCallback(async () => {
    setIsRunning(true);
    try {
      console.log('Starting scheduled discovery run...');
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('discover-ai-fails', {
        body: { source: 'scheduled' }
      });

      if (error) {
        throw error;
      }

      console.log('Scheduled discovery completed:', data);
      
      // Update last run time
      const now = new Date();
      setSchedule(prev => ({
        ...prev,
        lastRun: now,
        nextRun: calculateNextRun(now, prev.intervalHours),
      }));

      return data;
    } catch (error) {
      console.error('Scheduled discovery failed:', error);
      throw error;
    } finally {
      setIsRunning(false);
    }
  }, [calculateNextRun]);

  const updateSchedule = useCallback((newConfig: Partial<ScheduleConfig>) => {
    setSchedule(prev => {
      const updated = { ...prev, ...newConfig };
      
      // Recalculate next run if interval changed
      if (newConfig.intervalHours && updated.lastRun) {
        updated.nextRun = calculateNextRun(updated.lastRun, updated.intervalHours);
      }
      
      return updated;
    });
  }, [calculateNextRun]);

  const checkAndRunScheduledDiscovery = useCallback(async () => {
    if (!schedule.enabled || !schedule.nextRun || isRunning) {
      return;
    }

    const now = new Date();
    if (now >= schedule.nextRun) {
      await runDiscovery();
    }
  }, [schedule.enabled, schedule.nextRun, isRunning, runDiscovery]);

  // Check for scheduled runs every minute
  useEffect(() => {
    const interval = setInterval(checkAndRunScheduledDiscovery, 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAndRunScheduledDiscovery]);

  return {
    schedule,
    isRunning,
    updateSchedule,
    runDiscovery,
    timeUntilNextRun: schedule.nextRun ? Math.max(0, schedule.nextRun.getTime() - Date.now()) : 0,
  };
};
