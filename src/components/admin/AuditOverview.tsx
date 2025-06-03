
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, CheckCircle, AlertTriangle } from 'lucide-react';

interface AuditOverviewProps {
  audit: any;
  summary: any;
}

const AuditOverview = ({ audit, summary }: AuditOverviewProps) => {
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
            <div className="text-2xl font-bold text-blue-600">{summary.totalPages}</div>
            <div className="text-sm text-muted-foreground">Pages Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{summary.totalErrors}</div>
            <div className="text-sm text-muted-foreground">Issues Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.averageLoadTime}ms</div>
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
                {getScoreIcon(summary.imageAnalysis?.optimizationScore || 0)}
                <span className={`font-medium ${getScoreColor(summary.imageAnalysis?.optimizationScore || 0)}`}>
                  {summary.imageAnalysis?.optimizationScore || 0}%
                </span>
              </div>
            </div>
            <Progress value={summary.imageAnalysis?.optimizationScore || 0} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditOverview;
