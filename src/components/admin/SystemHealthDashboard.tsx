
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Activity, Database, Globe, RefreshCw, AlertTriangle } from 'lucide-react';
import MonitoringCard from './MonitoringCard';
import { useDiscoveryMetrics } from '@/hooks/useDiscoveryMetrics';
import { useErrorTracking } from '@/hooks/useErrorTracking';
import { supabase } from '@/lib/supabase';

const SystemHealthDashboard = () => {
  const { metrics, isLoading, refreshMetrics } = useDiscoveryMetrics();
  const { errors, errorCount } = useErrorTracking();
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');

  useEffect(() => {
    // Determine system health based on metrics
    if (errorCount > 5) {
      setSystemStatus('error');
    } else if (metrics.successRate < 70 || errorCount > 2) {
      setSystemStatus('warning');
    } else {
      setSystemStatus('healthy');
    }
  }, [errorCount, metrics.successRate]);

  const testDatabaseConnection = async () => {
    try {
      const { error } = await supabase.from('oopsies').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  };

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'healthy': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
    }
  };

  const getSystemStatusText = () => {
    switch (systemStatus) {
      case 'healthy': return 'All Systems Operational';
      case 'warning': return 'Minor Issues Detected';
      case 'error': return 'Critical Issues Found';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            System Health Overview
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshMetrics}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className={`text-lg font-semibold ${getSystemStatusColor()}`}>
              {getSystemStatusText()}
            </div>
            {systemStatus !== 'healthy' && (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MonitoringCard
              title="Content Discovered"
              value={metrics.totalDiscovered}
              icon={<Globe className="h-4 w-4" />}
              status="info"
              description="Total AI fails discovered"
            />
            <MonitoringCard
              title="Success Rate"
              value={`${metrics.successRate.toFixed(1)}%`}
              icon={<Database className="h-4 w-4" />}
              status={metrics.successRate >= 70 ? 'success' : 'warning'}
              description="Content approval rate"
            />
            <MonitoringCard
              title="Pending Review"
              value={metrics.pendingReview}
              icon={<AlertTriangle className="h-4 w-4" />}
              status={metrics.pendingReview > 10 ? 'warning' : 'success'}
              description="Awaiting manual review"
            />
            <MonitoringCard
              title="System Errors"
              value={errorCount}
              icon={<AlertTriangle className="h-4 w-4" />}
              status={errorCount > 0 ? 'error' : 'success'}
              description="Recent error count"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {metrics.approvedContent}
              </div>
              <div className="text-sm text-muted-foreground">Approved Content</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {metrics.pendingReview}
              </div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {metrics.rejectedContent}
              </div>
              <div className="text-sm text-muted-foreground">Rejected Content</div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-center">
            <div className="text-lg font-semibold">
              Average Confidence Score: {metrics.averageConfidenceScore.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              Higher scores indicate better content quality
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthDashboard;
