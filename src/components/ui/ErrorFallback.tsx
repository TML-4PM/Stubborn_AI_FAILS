
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  showDetails?: boolean;
}

const ErrorFallback = ({ error, resetErrorBoundary, showDetails = false }: ErrorFallbackProps) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  const getErrorType = (error: Error) => {
    if (error.message.includes('Network')) return 'Network Error';
    if (error.message.includes('Database')) return 'Database Error';
    if (error.message.includes('Authentication')) return 'Auth Error';
    if (error.message.includes('Permission')) return 'Permission Error';
    if (error.name === 'ChunkLoadError') return 'Loading Error';
    return 'Application Error';
  };

  const getErrorVariant = (errorType: string) => {
    switch (errorType) {
      case 'Network Error': return 'destructive';
      case 'Database Error': return 'destructive';
      case 'Auth Error': return 'secondary';
      case 'Permission Error': return 'secondary';
      case 'Loading Error': return 'outline';
      default: return 'destructive';
    }
  };

  const errorType = getErrorType(error);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle>Something went wrong</CardTitle>
            <Badge variant={getErrorVariant(errorType) as any}>
              {errorType}
            </Badge>
          </div>
          <CardDescription>
            We're sorry, but something unexpected happened. Please try one of the options below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Summary */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Error Summary:</p>
            <p className="text-sm">{error.message}</p>
          </div>

          {/* Detailed Error Information */}
          {(showDetails || process.env.NODE_ENV === 'development') && (
            <details className="rounded border p-3 text-sm">
              <summary className="cursor-pointer font-medium flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Technical Details
              </summary>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="font-medium text-muted-foreground">Error Name:</p>
                  <p className="font-mono text-xs">{error.name}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Error Message:</p>
                  <p className="font-mono text-xs">{error.message}</p>
                </div>
                {error.stack && (
                  <div>
                    <p className="font-medium text-muted-foreground">Stack Trace:</p>
                    <pre className="mt-1 overflow-auto text-xs text-muted-foreground bg-muted p-2 rounded max-h-32">
                      {error.stack}
                    </pre>
                  </div>
                )}
                <div>
                  <p className="font-medium text-muted-foreground">Timestamp:</p>
                  <p className="font-mono text-xs">{new Date().toISOString()}</p>
                </div>
              </div>
            </details>
          )}

          {/* Recovery Actions */}
          <div className="grid grid-cols-1 gap-2">
            <Button onClick={resetErrorBoundary} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleReload}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button variant="outline" onClick={handleGoHome}>
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="text-xs text-muted-foreground text-center">
            <p>If this error persists, try:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Clearing your browser cache</li>
              <li>Checking your internet connection</li>
              <li>Refreshing the page</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorFallback;
