
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorLog {
  id: string;
  timestamp: Date;
  error: Error;
  context: string;
  userId?: string;
  stack?: string;
  userAgent?: string;
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
      stack: error.stack,
      userAgent: navigator.userAgent,
    };

    setErrors(prev => [...prev.slice(-99), errorLog]); // Keep last 100 errors
    
    // Enhanced console logging with more details
    console.group(`🚨 [${context}] Error Details`);
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Context:', context);
    console.error('User ID:', userId);
    console.error('Timestamp:', errorLog.timestamp.toISOString());
    console.groupEnd();
    
    // Show user-friendly error message
    toast({
      title: "Something went wrong",
      description: `Error in ${context}: ${error.message}`,
      variant: "destructive",
    });

    // In production, you could send this to an external logging service
    // sendToLoggingService(errorLog);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getLastError = useCallback(() => {
    return errors[errors.length - 1];
  }, [errors]);

  return {
    errors,
    logError,
    clearErrors,
    getLastError,
    errorCount: errors.length,
  };
};
