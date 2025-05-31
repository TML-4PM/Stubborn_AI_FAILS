
import { useState } from 'react';
import { useMonitoring } from '@/hooks/useMonitoring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Wifi, 
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { cache } from '@/utils/caching';

const MonitoringDashboard = () => {
  const {
    metrics,
    errors,
    isOnline,
    connectionType,
    memoryUsage,
    getAverageMetric,
    getErrorRate
  } = useMonitoring();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const cacheStats = cache.getStats();
  const avgLCP = getAverageMetric('LCP');
  const avgFID = getAverageMetric('FID');
  const avgCLS = getAverageMetric('CLS');
  const errorRate = getErrorRate();

  const getPerformanceStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'LCP':
        return value <= 1200 ? 'good' : value <= 2500 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const recentMetrics = metrics.slice(-10);
  const recentErrors = errors.slice(-5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time application performance and health</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <p className="text-xs text-muted-foreground">
              Connection: {connectionType}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors (1h)</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${errorRate > 5 ? 'text-red-500' : 'text-green-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorRate}</div>
            <p className="text-xs text-muted-foreground">
              {errorRate <= 5 ? 'Low error rate' : 'High error rate'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {memoryUsage ? `${Math.round(memoryUsage * 100)}%` : 'N/A'}
            </div>
            <Progress 
              value={memoryUsage ? memoryUsage * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheStats.validItems}</div>
            <p className="text-xs text-muted-foreground">
              {cacheStats.expiredItems} expired
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Largest Contentful Paint</CardTitle>
                <CardDescription>Loading performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(getPerformanceStatus('LCP', avgLCP))}`} />
                  <span className="text-2xl font-bold">{Math.round(avgLCP)}ms</span>
                </div>
                <Badge variant={getPerformanceStatus('LCP', avgLCP) === 'good' ? 'default' : 'destructive'}>
                  {getPerformanceStatus('LCP', avgLCP)}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">First Input Delay</CardTitle>
                <CardDescription>Interactivity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(getPerformanceStatus('FID', avgFID))}`} />
                  <span className="text-2xl font-bold">{Math.round(avgFID)}ms</span>
                </div>
                <Badge variant={getPerformanceStatus('FID', avgFID) === 'good' ? 'default' : 'destructive'}>
                  {getPerformanceStatus('FID', avgFID)}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cumulative Layout Shift</CardTitle>
                <CardDescription>Visual stability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(getPerformanceStatus('CLS', avgCLS))}`} />
                  <span className="text-2xl font-bold">{avgCLS.toFixed(3)}</span>
                </div>
                <Badge variant={getPerformanceStatus('CLS', avgCLS) === 'good' ? 'default' : 'destructive'}>
                  {getPerformanceStatus('CLS', avgCLS)}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Errors</CardTitle>
              <CardDescription>Last 5 errors logged</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {recentErrors.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    No recent errors
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentErrors.map((error) => (
                      <div key={error.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium text-red-600">{error.message}</p>
                            <p className="text-sm text-muted-foreground">
                              {error.timestamp.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {error.url}
                            </p>
                          </div>
                        </div>
                        {error.stack && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm font-medium">Stack Trace</summary>
                            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                              {error.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Metrics</CardTitle>
              <CardDescription>Latest performance measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {recentMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{metric.name}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {metric.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono">{Math.round(metric.value)}ms</span>
                        <div className="text-xs text-muted-foreground">
                          {metric.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-mono">{cacheStats.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valid Items:</span>
                  <span className="font-mono">{cacheStats.validItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expired Items:</span>
                  <span className="font-mono">{cacheStats.expiredItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage:</span>
                  <span className="font-mono">{Math.round(cacheStats.memoryUsage / 1024)}KB</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => cache.clear()} 
                  className="w-full"
                >
                  Clear All Cache
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => cache.invalidateByTag('images')} 
                  className="w-full"
                >
                  Clear Image Cache
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => cache.invalidateByTag('api')} 
                  className="w-full"
                >
                  Clear API Cache
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;
