
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Image, 
  Link, 
  Clock,
  Eye,
  Target,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface AuditResultsProps {
  auditId: string;
}

interface AuditError {
  type: string;
  message: string;
  url?: string;
}

interface AuditPage {
  url: string;
  status: number;
  loadTime: number;
  title?: string;
  links?: Array<{ url: string; text: string }>;
  images?: Array<{ url: string; alt: string }>;
  errors?: AuditError[];
}

interface AuditResultsData {
  errors?: AuditError[];
  pages?: AuditPage[];
}

const AuditResults = ({ auditId }: AuditResultsProps) => {
  const { data: audit, isLoading } = useQuery({
    queryKey: ['audit-results', auditId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_audits')
        .select('*')
        .eq('id', auditId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!auditId
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading audit results...</p>
        </CardContent>
      </Card>
    );
  }

  if (!audit) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Audit not found.</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Type guard and safe parsing for JSONB data
  const parseAuditResults = (results: any): AuditResultsData => {
    if (!results || typeof results !== 'object') {
      return { errors: [], pages: [] };
    }
    return {
      errors: Array.isArray(results.errors) ? results.errors : [],
      pages: Array.isArray(results.pages) ? results.pages : []
    };
  };

  const results = parseAuditResults(audit.results);
  const summary = audit.summary || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Audit Results for {audit.domain}
            </div>
            <Badge variant={audit.status === 'completed' ? 'default' : 'secondary'}>
              {audit.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{audit.total_pages}</div>
              <div className="text-sm text-muted-foreground">Pages Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{audit.total_errors}</div>
              <div className="text-sm text-muted-foreground">Errors Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{audit.average_load_time}ms</div>
              <div className="text-sm text-muted-foreground">Avg Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {new Date(audit.created_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">Audit Date</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scores */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              SEO Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getScoreColor(audit.seo_score || 0)}>
                {audit.seo_score || 0}%
              </span>
            </div>
            <Progress 
              value={audit.seo_score || 0} 
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Based on title tags, meta descriptions, headings, and alt text
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Accessibility Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getScoreColor(audit.accessibility_score || 0)}>
                {audit.accessibility_score || 0}%
              </span>
            </div>
            <Progress 
              value={audit.accessibility_score || 0} 
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Alt text coverage, heading structure, and WCAG compliance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getScoreColor(audit.performance_score || 0)}>
                {audit.performance_score || 0}%
              </span>
            </div>
            <Progress 
              value={audit.performance_score || 0} 
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Load times and page responsiveness
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Issues Summary */}
      {results.errors && results.errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Issues ({results.errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.errors.slice(0, 10).map((error: AuditError, index: number) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{error.type}:</strong> {error.message}
                    {error.url && (
                      <div className="text-xs mt-1 opacity-75">
                        URL: {error.url}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
              {results.errors.length > 10 && (
                <p className="text-sm text-muted-foreground">
                  And {results.errors.length - 10} more issues...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Details */}
      {results.pages && results.pages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Page Analysis ({results.pages.length} pages)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.pages.slice(0, 5).map((page: AuditPage, index: number) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium truncate">{page.url}</h4>
                    <Badge variant={page.status >= 400 ? 'destructive' : 'default'}>
                      {page.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium">{page.title || 'No title'}</span>
                  </div>
                  
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {page.loadTime}ms
                    </span>
                    <span className="flex items-center gap-1">
                      <Link className="h-3 w-3" />
                      {page.links?.length || 0} links
                    </span>
                    <span className="flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      {page.images?.length || 0} images
                    </span>
                    {page.errors && page.errors.length > 0 && (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        {page.errors.length} issues
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {results.pages.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  And {results.pages.length - 5} more pages analyzed...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {audit.seo_score < 80 && (
              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>SEO Improvement:</strong> Focus on optimizing title tags and meta descriptions. 
                  Ensure all pages have unique, descriptive titles between 30-60 characters.
                </AlertDescription>
              </Alert>
            )}
            
            {audit.accessibility_score < 80 && (
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <strong>Accessibility Improvement:</strong> Add alt text to all images and ensure 
                  proper heading structure (start with H1, don't skip levels).
                </AlertDescription>
              </Alert>
            )}
            
            {audit.performance_score < 80 && (
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Performance Improvement:</strong> Optimize page load times by compressing images, 
                  minifying CSS/JS, and using a CDN for static assets.
                </AlertDescription>
              </Alert>
            )}
            
            {audit.total_errors === 0 && audit.seo_score >= 80 && audit.accessibility_score >= 80 && audit.performance_score >= 80 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Great job!</strong> Your website passed all major checks. 
                  Continue monitoring regularly to maintain these high standards.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditResults;
