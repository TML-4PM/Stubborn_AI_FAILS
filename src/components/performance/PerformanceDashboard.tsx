
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Database, Image, Zap, Trash2, RefreshCw } from 'lucide-react';
import { performanceCache } from '@/utils/performanceCache';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

const PerformanceDashboard = () => {
  const [cacheStats, setCacheStats] = useState(performanceCache.getStats());
  const [webVitals, setWebVitals] = useState<any>({});
  const { measurePerformance } = usePerformanceMonitoring();

  useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(performanceCache.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const clearCache = (namespace?: string) => {
    if (namespace) {
      performanceCache.invalidateNamespace(namespace);
    } else {
      // Clear all cache
      Object.keys(cacheStats.namespaces).forEach(ns => {
        performanceCache.invalidateNamespace(ns);
      });
    }
    setCacheStats(performanceCache.getStats());
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => clearCache()}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Cache
        </Button>
      </div>

      <Tabs defaultValue="cache" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cache">Cache Performance</TabsTrigger>
          <TabsTrigger value="vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="cache" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cacheStats.totalItems}</div>
                <p className="text-xs text-muted-foreground">
                  Cached items across all namespaces
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatBytes(cacheStats.memoryUsage)}</div>
                <p className="text-xs text-muted-foreground">
                  Estimated memory consumption
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hit Rate</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cacheStats.hitRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Cache effectiveness
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cache by Namespace</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(cacheStats.namespaces).map(([namespace, count]) => (
                  <div key={namespace} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{namespace}</Badge>
                      <span className="text-sm text-muted-foreground">{count} items</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearCache(namespace)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(webVitals).map(([metric, value]: [string, any]) => (
              <Card key={metric}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium uppercase">
                    {metric}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {typeof value === 'number' ? Math.round(value) : value}
                    {metric.includes('time') ? 'ms' : ''}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Database optimization recommendations:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Add indexes for frequently queried columns</li>
                  <li>• Implement pagination for large result sets</li>
                  <li>• Use materialized views for complex aggregations</li>
                  <li>• Consider read replicas for scaling</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Image optimization status:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Progressive loading: ✅ Enabled</li>
                  <li>• WebP support: ✅ Enabled</li>
                  <li>• Lazy loading: ✅ Enabled</li>
                  <li>• CDN integration: ⚠️ Recommended</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
