
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Globe, 
  AlertTriangle, 
  Zap, 
  Activity, 
  CheckCircle, 
  Shield, 
  TrendingUp,
  Search,
  Play
} from 'lucide-react';

interface AuditData {
  id: string;
  domain: string;
  status: string;
  audit_type: string;
  created_at: string;
  total_pages: number;
  total_errors: number;
  average_load_time: number;
  seo_score: number | null;
  accessibility_score: number | null;
  performance_score: number | null;
}

interface AuditHistoryListProps {
  audits?: AuditData[];
  isLoading: boolean;
  error: any;
  isRunning: boolean;
  onRetry: () => void;
  onStartAudit: () => void;
  onSelectAudit: (auditId: string) => void;
}

const AuditHistoryList = ({ 
  audits, 
  isLoading, 
  error, 
  isRunning,
  onRetry, 
  onStartAudit, 
  onSelectAudit 
}: AuditHistoryListProps) => {
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

  return (
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
            <Button onClick={onRetry}>
              Retry
            </Button>
          </div>
        ) : audits && audits.length > 0 ? (
          <div className="space-y-4">
            {audits.map((audit) => (
              <div
                key={audit.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onSelectAudit(audit.id)}
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
            <Button onClick={onStartAudit} disabled={isRunning}>
              <Play className="mr-2 h-4 w-4" />
              Start First Audit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditHistoryList;
