
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Play,
  TrendingUp,
  Activity,
  Target,
  Zap,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AuditResults from './AuditResults';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SiteAuditPanel = () => {
  const [auditType, setAuditType] = useState<'full' | 'seo' | 'accessibility' | 'performance'>('full');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const queryClient = useQueryClient();

  // Auto-detect current domain
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';

  // Fetch recent audits with better error handling
  const { data: audits, isLoading, error } = useQuery({
    queryKey: ['site-audits'],
    queryFn: async () => {
      console.log('Fetching site audits...');
      const { data, error } = await supabase
        .from('site_audits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching audits:', error);
        throw error;
      }
      
      console.log('Fetched audits:', data);
      return data;
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Start audit mutation
  const startAuditMutation = useMutation({
    mutationFn: async ({ auditType }: { auditType: string }) => {
      setIsRunning(true);
      console.log('Starting audit with type:', auditType);
      
      const { data, error } = await supabase.functions.invoke('website-audit', {
        body: { 
          baseUrl: currentDomain,
          auditType,
          maxPages: 15
        }
      });
      
      if (error) {
        console.error('Audit error:', error);
        throw error;
      }
      
      console.log('Audit completed:', data);
      return data;
    },
    onSuccess: (data) => {
      setIsRunning(false);
      toast({
        title: "Site Audit Complete! ✅",
        description: `Found ${data.results?.summary?.totalErrors || 0} issues across ${data.results?.summary?.totalPages || 0} pages.`,
      });
      queryClient.invalidateQueries({ queryKey: ['site-audits'] });
      setSelectedAuditId(data.auditId);
    },
    onError: (error: any) => {
      setIsRunning(false);
      console.error('Audit mutation error:', error);
      toast({
        title: "Audit Failed ❌",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleStartAudit = () => {
    console.log('Manual audit triggered');
    startAuditMutation.mutate({ auditType });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      running: "secondary",
      completed: "default",
      failed: "destructive"
    };
    
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  if (error) {
    console.error('Query error:', error);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            AI Fails Site Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Search className="h-4 w-4" />
            <AlertDescription>
              Comprehensive analysis of this AI Fails website - SEO, accessibility, performance, and functionality.
              Manually run audits to monitor key pages and features for optimal user experience.
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">Auditing Website</h4>
                <p className="text-sm text-muted-foreground">{currentDomain}</p>
              </div>
              <div className="flex gap-2">
                <Select value={auditType} onValueChange={(value: any) => setAuditType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">🔍 Full Site Audit</SelectItem>
                    <SelectItem value="seo">🎯 SEO Analysis</SelectItem>
                    <SelectItem value="accessibility">♿ Accessibility Check</SelectItem>
                    <SelectItem value="performance">⚡ Performance Test</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleStartAudit}
                  disabled={isRunning}
                  className="px-6"
                >
                  {isRunning ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Audit
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {isRunning && (
              <div className="space-y-2">
                <Progress value={65} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Crawling pages and analyzing content...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">📊 Audit History</TabsTrigger>
          <TabsTrigger value="results">📋 Detailed Results</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Site Audits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading audit history...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
                  <p className="text-red-500 mb-4">Failed to load audit history</p>
                  <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['site-audits'] })}>
                    Retry
                  </Button>
                </div>
              ) : audits && audits.length > 0 ? (
                <div className="space-y-4">
                  {audits.map((audit) => (
                    <div
                      key={audit.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAuditId(audit.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{audit.domain}</h4>
                          {getStatusBadge(audit.status)}
                          <Badge variant="outline" className="capitalize">
                            {audit.audit_type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(audit.created_at).toLocaleDateString()} at{' '}
                          {new Date(audit.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {audit.total_pages} pages
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {audit.total_errors} issues
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {audit.average_load_time}ms avg
                        </span>
                      </div>

                      {audit.status === 'completed' && (
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            {getScoreIcon(audit.seo_score || 0)}
                            <div>
                              <div className="text-xs text-muted-foreground">SEO</div>
                              <div className={`font-medium ${getScoreColor(audit.seo_score || 0)}`}>
                                {audit.seo_score || 0}%
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="text-xs text-muted-foreground">Accessibility</div>
                              <div className={`font-medium ${getScoreColor(audit.accessibility_score || 0)}`}>
                                {audit.accessibility_score || 0}%
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            <div>
                              <div className="text-xs text-muted-foreground">Performance</div>
                              <div className={`font-medium ${getScoreColor(audit.performance_score || 0)}`}>
                                {audit.performance_score || 0}%
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <div>
                              <div className="text-xs text-muted-foreground">Overall</div>
                              <div className={`font-medium ${getScoreColor(Math.round(((audit.seo_score || 0) + (audit.accessibility_score || 0) + (audit.performance_score || 0)) / 3))}`}>
                                {Math.round(((audit.seo_score || 0) + (audit.accessibility_score || 0) + (audit.performance_score || 0)) / 3)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No audits found. Run your first site health check!</p>
                  <Button onClick={handleStartAudit} disabled={isRunning}>
                    <Play className="mr-2 h-4 w-4" />
                    Start First Audit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {selectedAuditId ? (
            <AuditResults auditId={selectedAuditId} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <Eye className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select an audit from the history tab to view detailed analysis and recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteAuditPanel;
