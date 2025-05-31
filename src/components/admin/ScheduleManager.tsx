
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Play, Settings } from 'lucide-react';
import { useScheduledDiscovery } from '@/hooks/useScheduledDiscovery';
import { toast } from '@/hooks/use-toast';

const ScheduleManager = () => {
  const { schedule, isRunning, updateSchedule, runDiscovery, timeUntilNextRun } = useScheduledDiscovery();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleSchedule = async (enabled: boolean) => {
    setIsUpdating(true);
    try {
      updateSchedule({ enabled });
      toast({
        title: enabled ? "Schedule Enabled" : "Schedule Disabled",
        description: enabled 
          ? `Discovery will run every ${schedule.intervalHours} hours`
          : "Automatic discovery has been disabled",
      });
    } catch (error) {
      toast({
        title: "Failed to update schedule",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIntervalChange = (value: string) => {
    const intervalHours = parseInt(value);
    updateSchedule({ intervalHours });
    toast({
      title: "Schedule Updated",
      description: `Discovery interval set to ${intervalHours} hours`,
    });
  };

  const handleManualRun = async () => {
    try {
      await runDiscovery();
      toast({
        title: "Discovery Started",
        description: "Manual discovery process has been initiated",
      });
    } catch (error) {
      toast({
        title: "Discovery Failed",
        description: "Failed to start discovery process",
        variant: "destructive",
      });
    }
  };

  const formatTimeUntilNext = (milliseconds: number) => {
    if (milliseconds <= 0) return 'Now';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Discovery Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="schedule-enabled">Automatic Discovery</Label>
            <p className="text-sm text-muted-foreground">
              Enable scheduled discovery runs
            </p>
          </div>
          <Switch
            id="schedule-enabled"
            checked={schedule.enabled}
            onCheckedChange={handleToggleSchedule}
            disabled={isUpdating}
          />
        </div>

        <div className="space-y-3">
          <Label>Discovery Interval</Label>
          <Select 
            value={schedule.intervalHours.toString()} 
            onValueChange={handleIntervalChange}
            disabled={!schedule.enabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Every 1 hour</SelectItem>
              <SelectItem value="2">Every 2 hours</SelectItem>
              <SelectItem value="4">Every 4 hours</SelectItem>
              <SelectItem value="6">Every 6 hours</SelectItem>
              <SelectItem value="12">Every 12 hours</SelectItem>
              <SelectItem value="24">Every 24 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {schedule.enabled && schedule.nextRun && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-1">Next scheduled run in:</div>
            <div className="text-lg font-bold text-primary">
              {formatTimeUntilNext(timeUntilNextRun)}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleManualRun} 
            disabled={isRunning}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Now'}
          </Button>
          
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleManager;
