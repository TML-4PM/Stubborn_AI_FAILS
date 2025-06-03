
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Download,
  Play,
  TrendingUp,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AuditResults from './AuditResults';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SiteAuditPanel = () => {
  const [auditUrl, setAuditUrl] = useState('');
  const [auditType, setAuditType] = useState<'full' | 'seo' | 'accessibility' | 'performance'>('full');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch recent audits
  const { data: audits, isLoading } = useQuery({
    queryKey: ['site-audits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_audits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  // Start audit mutation
  const startAuditMutation = useMutation({
    mutationFn: async ({ url, type }: { url: string; type: string }) => {
      const { data, error } = await supabase.functions.invoke('website-audit', {
        body: { url, auditType: type, maxPages: 10 }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Audit Started! 🔍",
        description: "Your website audit is now running. Check back in a few minutes for results.",
      });
      queryClient.invalidateQueries({ queryKey: ['site-audits'] });
      setSelectedAuditId(data.auditId);
    },
    onError: (error) => {
      toast({
        title: "Audit Failed ❌",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleStartAudit = () => {
    if (!auditUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to audit.",
        variant: "destructive",
      });
      return;
    }

    startAuditMutation.mutate({ url: auditUrl.trim(), type: auditType });
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
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Audit Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Search className="h-4 w-4" />
            <AlertDescription>
              Analyze any website for SEO, accessibility, performance issues, and broken links.
              Results are saved for comparison over time.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter website URL (e.g., https://example.com)"
                value={auditUrl}
                onChange={(e) => setAuditUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleStartAudit()}
              />
            </div>
            <Select value={auditType} onValueChange={(value: any) => setAuditType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Audit</SelectItem>
                <SelectItem value="seo">SEO Only</SelectItem>
                <SelectItem value="accessibility">Accessibility Only</SelectItem>
                <SelectItem value="performance">Performance Only</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleStartAudit}
              disabled={startAuditMutation.isPending}
              className="px-6"
            >
              {startAuditMutation.isPending ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Audit
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent Audits</TabsTrigger>
          <TabsTrigger value="results">Audit Results</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Audits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading audits...</p>
                </div>
              ) : audits && audits.length > 0 ? (
                <div className="space-y-4">
                  {audits.map((audit) => (
                    <div
                      key={audit.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAuditId(audit.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{audit.domain}</h4>
                          {getStatusBadge(audit.status)}
                          <Badge variant="outline">{audit.audit_type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(audit.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{audit.total_pages} pages</span>
                        <span>{audit.total_errors} errors</span>
                        <span>{audit.average_load_time}ms avg load</span>
                      </div>

                      {audit.status === 'completed' && (
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">SEO:</span>
                            <span className={`font-medium ${getScoreColor(audit.seo_score || 0)}`}>
                              {audit.seo_score}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Accessibility:</span>
                            <span className={`font-medium ${getScoreColor(audit.accessibility_score || 0)}`}>
                              {audit.accessibility_score}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Performance:</span>
                            <span className={`font-medium ${getScoreColor(audit.performance_score || 0)}`}>
                              {audit.performance_score}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No audits yet. Start your first audit above!</p>
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
                  Select an audit from the Recent Audits tab to view detailed results.
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
