
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  errorMessage: string | null;
  onTryAgain: () => void;
}

const ErrorDisplay = ({ errorMessage, onTryAgain }: ErrorDisplayProps) => {
  if (!errorMessage) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="ml-2">
        {errorMessage}
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2"
          onClick={onTryAgain}
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
