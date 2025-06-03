
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, Search } from 'lucide-react';

const AuditHeader = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          AI Fails Site Health Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <Search className="h-4 w-4" />
          <AlertDescription>
            Comprehensive analysis of this AI Fails website - SEO, accessibility, performance, and functionality.
            Manually run audits to monitor key pages and features for optimal user experience.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default AuditHeader;
