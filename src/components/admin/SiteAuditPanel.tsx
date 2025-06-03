
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AuditHeader from './AuditHeader';
import AuditControls from './AuditControls';
import AuditHistoryList from './AuditHistoryList';
import AuditResults from './AuditResults';

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

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['site-audits'] });
  };

  if (error) {
    console.error('Query error:', error);
  }

  return (
    <div className="space-y-6">
      <AuditHeader />
      
      <AuditControls 
        auditType={auditType}
        setAuditType={setAuditType}
        currentDomain={currentDomain}
        isRunning={isRunning}
        onStartAudit={handleStartAudit}
      />

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">📊 Audit History</TabsTrigger>
          <TabsTrigger value="results">📋 Detailed Results</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <AuditHistoryList 
            audits={audits}
            isLoading={isLoading}
            error={error}
            isRunning={isRunning}
            onRetry={handleRetry}
            onStartAudit={handleStartAudit}
            onSelectAudit={setSelectedAuditId}
          />
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
