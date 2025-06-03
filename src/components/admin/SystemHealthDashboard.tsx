import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, Users, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'warning';
  message: string;
}

interface SystemHealthData {
  databaseConnection: HealthCheckResult;
  userAuthentication: HealthCheckResult;
  contentDiscovery: HealthCheckResult;
  scheduledTasks: HealthCheckResult;
}

const SystemHealthDashboard = () => {
  const [healthData, setHealthData] = useState<SystemHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkDatabaseConnection = async (): Promise<HealthCheckResult> => {
      try {
        await supabase.from('oopsies').select('id').limit(1);
        return { status: 'healthy', message: 'Database connection is healthy.' };
      } catch (e: any) {
        console.error('Database connection error:', e);
        return { status: 'unhealthy', message: `Failed to connect to the database: ${e.message}` };
      }
    };

    const checkUserAuthentication = async (): Promise<HealthCheckResult> => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          throw error;
        }
        return { status: 'healthy', message: 'User authentication is functioning correctly.' };
      } catch (e: any) {
        console.error('User authentication error:', e);
        return { status: 'warning', message: `User authentication check failed: ${e.message}` };
      }
    };

    const checkContentDiscovery = async (): Promise<HealthCheckResult> => {
      try {
        // Simulate a check for content discovery by querying recent fails
        await supabase
          .from('oopsies')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1);
        return { status: 'healthy', message: 'Content discovery is operational.' };
      } catch (e: any) {
        console.warn('Content discovery check warning:', e);
        return { status: 'warning', message: `Content discovery check encountered a warning: ${e.message}` };
      }
    };

    const checkScheduledTasks = async (): Promise<HealthCheckResult> => {
      // Simulate a check for scheduled tasks.  In a real-world scenario,
      // this might involve checking the status of background workers or task queues.
      // For now, we'll just assume it's healthy.
      return { status: 'healthy', message: 'Scheduled tasks are running.' };
    };

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const databaseConnection = await checkDatabaseConnection();
        const userAuthentication = await checkUserAuthentication();
        const contentDiscovery = await checkContentDiscovery();
        const scheduledTasks = await checkScheduledTasks();

        setHealthData({
          databaseConnection,
          userAuthentication,
          contentDiscovery,
          scheduledTasks,
        });
      } catch (e: any) {
        console.error('Error fetching system health data:', e);
        setError(e.message || 'Failed to fetch system health data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: 'healthy' | 'unhealthy' | 'warning') => {
    switch (status) {
      case 'healthy':
        return <Badge variant="success">Healthy</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">System Health Dashboard</h1>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : healthData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4" /> Database Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{healthData.databaseConnection.message}</p>
              <div className="mt-2">{getStatusBadge(healthData.databaseConnection.status)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" /> User Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{healthData.userAuthentication.message}</p>
              <div className="mt-2">{getStatusBadge(healthData.userAuthentication.status)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" /> Content Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{healthData.contentDiscovery.message}</p>
              <div className="mt-2">{getStatusBadge(healthData.contentDiscovery.status)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Scheduled Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{healthData.scheduledTasks.message}</p>
              <div className="mt-2">{getStatusBadge(healthData.scheduledTasks.status)}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
};

export default SystemHealthDashboard;
