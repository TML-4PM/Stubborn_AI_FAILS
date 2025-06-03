
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useDataInitialization } from '@/hooks/useDataInitialization';

const DataInitializer = () => {
  const { isInitializing, isInitialized, initializeData } = useDataInitialization();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Initialization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Database Status</p>
            <p className="text-sm text-muted-foreground">
              Initialize sample data for development and testing
            </p>
          </div>
          <Badge variant={isInitialized ? "default" : "secondary"}>
            {isInitialized ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Initialized
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Initialized
              </>
            )}
          </Badge>
        </div>

        {!isInitialized && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              This will populate the database with:
            </p>
            <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
              <li>• 10 sample AI fail submissions</li>
              <li>• Printify integration settings</li>
              <li>• Default system configurations</li>
            </ul>
          </div>
        )}

        <Button 
          onClick={initializeData}
          disabled={isInitializing || isInitialized}
          className="w-full"
        >
          {isInitializing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : isInitialized ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Data Already Initialized
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Initialize Sample Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataInitializer;
