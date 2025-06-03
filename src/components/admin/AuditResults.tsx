
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp,
  Activity,
  AlertTriangle,
  FileImage
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AuditOverview from './AuditOverview';
import AuditPagesTab from './AuditPagesTab';
import AuditErrorsTab from './AuditErrorsTab';
import AuditRecommendationsTab from './AuditRecommendationsTab';
import ImageAuditResults from './ImageAuditResults';

interface AuditResultsProps {
  auditId: string;
}

// Type guards for audit data
const isAuditSummary = (data: any): data is {
  totalPages: number;
  totalErrors: number;
  averageLoadTime: number;
  brokenLinks: number;
  brokenImages: number;
  imageAnalysis?: {
    totalImages: number;
    unoptimizedImages: number;
    imagesWithoutAlt: number;
    largeImages: number;
    optimizationScore: number;
  };
} => {
  return data && typeof data === 'object' && typeof data.totalPages === 'number';
};

const isAuditResults = (data: any): data is {
  pages: any[];
  errors: any[];
} => {
  return data && typeof data === 'object' && Array.isArray(data.pages);
};

const AuditResults = ({ auditId }: AuditResultsProps) => {
  const { data: audit, isLoading, error } = useQuery({
    queryKey: ['audit-results', auditId],
    queryFn: async () => {
      console.log('Fetching audit results for ID:', auditId);
      const { data, error } = await supabase
        .from('site_audits')
        .select('*')
        .eq('id', auditId)
        .single();
      
      if (error) {
        console.error('Error fetching audit:', error);
        throw error;
      }
      
      console.log('Fetched audit data:', data);
      return data;
    },
    enabled: !!auditId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading audit results...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !audit) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-500 mb-4">Failed to load audit results</p>
          <p className="text-sm text-muted-foreground">Audit ID: {auditId}</p>
        </CardContent>
      </Card>
    );
  }

  const results = audit.results;
  const summary = audit.summary;

  if (!results || !summary) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-yellow-500" />
          <p className="text-muted-foreground">No detailed results available for this audit</p>
        </CardContent>
      </Card>
    );
  }

  const parsedSummary = isAuditSummary(summary) ? summary : { 
    totalPages: 0, 
    totalErrors: 0, 
    averageLoadTime: 0,
    brokenLinks: 0, 
    brokenImages: 0, 
    imageAnalysis: {
      totalImages: 0,
      unoptimizedImages: 0,
      imagesWithoutAlt: 0,
      largeImages: 0,
      optimizationScore: 0
    }
  };

  const parsedResults = isAuditResults(results) ? results : { pages: [], errors: [] };

  return (
    <div className="space-y-6">
      <AuditOverview audit={audit} summary={parsedSummary} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="images">🖼️ Images ({parsedSummary.imageAnalysis?.totalImages || 0})</TabsTrigger>
          <TabsTrigger value="pages">📄 Pages</TabsTrigger>
          <TabsTrigger value="errors">🚨 Issues</TabsTrigger>
          <TabsTrigger value="recommendations">💡 Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </h3>
                <div className="flex justify-between">
                  <span className="text-sm">Average Load Time:</span>
                  <span className="text-sm font-medium">{parsedSummary.averageLoadTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Pages:</span>
                  <span className="text-sm font-medium">{parsedSummary.totalPages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Broken Links:</span>
                  <span className="text-sm font-medium text-red-600">{parsedSummary.brokenLinks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Broken Images:</span>
                  <span className="text-sm font-medium text-red-600">{parsedSummary.brokenImages}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Image Analysis
                </h3>
                <div className="flex justify-between">
                  <span className="text-sm">Total Images:</span>
                  <span className="text-sm font-medium">{parsedSummary.imageAnalysis?.totalImages || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Unoptimized:</span>
                  <span className="text-sm font-medium text-red-600">{parsedSummary.imageAnalysis?.unoptimizedImages || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Missing Alt Text:</span>
                  <span className="text-sm font-medium text-orange-600">{parsedSummary.imageAnalysis?.imagesWithoutAlt || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Large Images:</span>
                  <span className="text-sm font-medium text-yellow-600">{parsedSummary.imageAnalysis?.largeImages || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images">
          {parsedSummary.imageAnalysis ? (
            <ImageAuditResults auditResults={results} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <FileImage className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No image analysis data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <AuditPagesTab pages={parsedResults.pages || []} />
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <AuditErrorsTab errors={parsedResults.errors || []} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <AuditRecommendationsTab audit={audit} summary={parsedSummary} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditResults;
