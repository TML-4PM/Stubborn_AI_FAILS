
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, RefreshCw, CheckCircle, AlertCircle, Clock, Info } from 'lucide-react';
import { useDataInitialization } from '@/hooks/useDataInitialization';

const DataInitializer = () => {
  const { 
    isInitializing, 
    isInitialized, 
    error, 
    initializationProgress,
    initializeData 
  } = useDataInitialization();

  const getProgressValue = () => {
    if (isInitialized) return 100;
    if (error) return 0;
    if (isInitializing) {
      // Estimate progress based on the current step
      if (initializationProgress.includes('Starting')) return 10;
      if (initializationProgress.includes('Checking')) return 20;
      if (initializationProgress.includes('Preparing')) return 30;
      if (initializationProgress.includes('Inserting')) return 70;
      if (initializationProgress.includes('Finalizing')) return 90;
      return 50;
    }
    return 0;
  };

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
          <Badge variant={isInitialized ? "default" : error ? "destructive" : "secondary"}>
            {isInitialized ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Initialized
              </>
            ) : error ? (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Failed
              </>
            ) : isInitializing ? (
              <>
                <Clock className="h-3 w-3 mr-1" />
                Initializing
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Initialized
              </>
            )}
          </Badge>
        </div>

        {/* Progress Indicator */}
        {(isInitializing || isInitialized) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{getProgressValue()}%</span>
            </div>
            <Progress value={getProgressValue()} className="w-full" />
            {initializationProgress && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Info className="h-3 w-3" />
                {initializationProgress}
              </p>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Initialization failed:</strong> {error}
              <br />
              <span className="text-sm">Check the browser console for detailed error logs.</span>
            </AlertDescription>
          </Alert>
        )}

        {!isInitialized && !error && (
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
          ) : error ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Initialization
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Initialize Sample Data
            </>
          )}
        </Button>

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-xs">
            <summary className="cursor-pointer font-medium">Debug Information</summary>
            <div className="mt-2 space-y-1 text-muted-foreground">
              <p>Is Initializing: {isInitializing.toString()}</p>
              <p>Is Initialized: {isInitialized.toString()}</p>
              <p>Has Error: {!!error}</p>
              <p>Progress: {initializationProgress || 'None'}</p>
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
};

export default DataInitializer;
