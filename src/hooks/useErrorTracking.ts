
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorLog {
  id: string;
  timestamp: Date;
  error: Error;
  context: string;
  userId?: string;
}

export const useErrorTracking = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);

  const logError = useCallback((error: Error, context: string, userId?: string) => {
    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      error,
      context,
      userId,
    };

    setErrors(prev => [...prev.slice(-99), errorLog]); // Keep last 100 errors
    
    console.error(`[${context}] Error:`, error);
    
    // Show user-friendly error message
    toast({
      title: "Something went wrong",
      description: "We've logged this issue and will look into it.",
      variant: "destructive",
    });

    // In production, you could send this to an external logging service
    // sendToLoggingService(errorLog);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    logError,
    clearErrors,
    errorCount: errors.length,
  };
};
