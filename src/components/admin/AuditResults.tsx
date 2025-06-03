
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  FileImage,
  ExternalLink,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Audit Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Audit Results - {audit.domain}
            </div>
            <Badge variant="outline" className="capitalize">
              {audit.audit_type.replace('_', ' ')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{parsedSummary.totalPages}</div>
              <div className="text-sm text-muted-foreground">Pages Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{parsedSummary.totalErrors}</div>
              <div className="text-sm text-muted-foreground">Issues Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{parsedSummary.averageLoadTime}ms</div>
              <div className="text-sm text-muted-foreground">Avg Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{audit.seo_score}%</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SEO</span>
                <div className="flex items-center gap-1">
                  {getScoreIcon(audit.seo_score || 0)}
                  <span className={`font-medium ${getScoreColor(audit.seo_score || 0)}`}>
                    {audit.seo_score}%
                  </span>
                </div>
              </div>
              <Progress value={audit.seo_score || 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accessibility</span>
                <div className="flex items-center gap-1">
                  {getScoreIcon(audit.accessibility_score || 0)}
                  <span className={`font-medium ${getScoreColor(audit.accessibility_score || 0)}`}>
                    {audit.accessibility_score}%
                  </span>
                </div>
              </div>
              <Progress value={audit.accessibility_score || 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance</span>
                <div className="flex items-center gap-1">
                  {getScoreIcon(audit.performance_score || 0)}
                  <span className={`font-medium ${getScoreColor(audit.performance_score || 0)}`}>
                    {audit.performance_score}%
                  </span>
                </div>
              </div>
              <Progress value={audit.performance_score || 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Images</span>
                <div className="flex items-center gap-1">
                  {getScoreIcon(parsedSummary.imageAnalysis?.optimizationScore || 0)}
                  <span className={`font-medium ${getScoreColor(parsedSummary.imageAnalysis?.optimizationScore || 0)}`}>
                    {parsedSummary.imageAnalysis?.optimizationScore || 0}%
                  </span>
                </div>
              </div>
              <Progress value={parsedSummary.imageAnalysis?.optimizationScore || 0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Analyzed Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {parsedResults.pages && parsedResults.pages.length > 0 ? (
                <div className="space-y-4">
                  {parsedResults.pages.map((page: any, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPage(selectedPage === page.url ? null : page.url)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{page.title || 'Untitled Page'}</h4>
                          <Badge variant={page.status === 200 ? "default" : "destructive"}>
                            {page.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {page.loadTime}ms
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {page.url}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {page.links?.length || 0} links
                        </span>
                        <span className="flex items-center gap-1">
                          <FileImage className="h-3 w-3" />
                          {page.images?.length || 0} images
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {page.errors?.length || 0} issues
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No pages found in audit results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Issues Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              {parsedResults.errors && parsedResults.errors.length > 0 ? (
                <div className="space-y-3">
                  {parsedResults.errors.map((error: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                          error.severity === 'critical' ? 'text-red-500' : 
                          error.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={
                              error.severity === 'critical' ? 'destructive' : 
                              error.severity === 'warning' ? 'secondary' : 'outline'
                            }>
                              {error.type?.replace('_', ' ') || 'Unknown'}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {error.severity || 'info'}
                            </Badge>
                          </div>
                          <p className="text-sm">{error.message || 'No description available'}</p>
                          {error.url && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Page: {error.url}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
                  <p className="text-muted-foreground">No issues found! Your site is in great shape.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  Here are personalized recommendations based on your audit results to improve your site's performance, SEO, and accessibility.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {/* Image Recommendations */}
                {parsedSummary.imageAnalysis && parsedSummary.imageAnalysis.unoptimizedImages > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      Image Optimization
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {parsedSummary.imageAnalysis.unoptimizedImages} images need optimization
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Convert images to modern formats (WebP, AVIF)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Implement lazy loading for below-the-fold images
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Add proper alt text for accessibility
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Use responsive images with srcset
                      </li>
                    </ul>
                  </div>
                )}

                {/* Performance Recommendations */}
                {parsedSummary.averageLoadTime > 3000 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Performance Optimization
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Average load time is {parsedSummary.averageLoadTime}ms (target: &lt;3000ms)
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Optimize and compress images
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Enable browser caching
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Minify CSS and JavaScript
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Use a Content Delivery Network (CDN)
                      </li>
                    </ul>
                  </div>
                )}

                {/* SEO Recommendations */}
                {audit.seo_score < 80 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      SEO Improvements
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      SEO score: {audit.seo_score}% (target: 90%+)
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Optimize page titles (30-60 characters)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Write compelling meta descriptions (120-160 characters)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Ensure proper heading structure (H1-H6)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Add alt text to all images
                      </li>
                    </ul>
                  </div>
                )}

                {/* Accessibility Recommendations */}
                {audit.accessibility_score < 80 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Accessibility Improvements
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Accessibility score: {audit.accessibility_score}% (target: 90%+)
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Add alt text to all images
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Ensure proper color contrast ratios
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Use semantic HTML elements
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Add keyboard navigation support
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditResults;
