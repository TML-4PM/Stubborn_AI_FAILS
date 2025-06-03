
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AuditErrorsTabProps {
  errors: any[];
}

const AuditErrorsTab = ({ errors }: AuditErrorsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Issues Found
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errors && errors.length > 0 ? (
          <div className="space-y-3">
            {errors.map((error: any, index: number) => (
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
  );
};

export default AuditErrorsTab;
