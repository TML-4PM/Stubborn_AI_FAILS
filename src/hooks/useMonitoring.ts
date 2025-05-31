
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  type: 'timing' | 'navigation' | 'resource' | 'custom';
  details?: Record<string, any>;
}

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  url: string;
  userAgent: string;
  userId?: string;
}

interface MonitoringState {
  metrics: PerformanceMetric[];
  errors: ErrorLog[];
  isOnline: boolean;
  connectionType: string;
  memoryUsage?: number;
}

export const useMonitoring = () => {
  const [state, setState] = useState<MonitoringState>({
    metrics: [],
    errors: [],
    isOnline: navigator.onLine,
    connectionType: 'unknown'
  });

  // Track performance metrics
  const trackMetric = useCallback((name: string, value: number, type: PerformanceMetric['type'] = 'custom', details?: Record<string, any>) => {
    const metric: PerformanceMetric = {
      id: crypto.randomUUID(),
      name,
      value,
      timestamp: new Date(),
      type,
      details
    };

    setState(prev => ({
      ...prev,
      metrics: [...prev.metrics.slice(-99), metric] // Keep last 100 metrics
    }));

    // Log critical performance issues
    if (value > 1000 && type === 'timing') {
      console.warn(`Slow operation detected: ${name} took ${value}ms`);
    }
  }, []);

  // Track errors
  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: context?.userId
    };

    setState(prev => ({
      ...prev,
      errors: [...prev.errors.slice(-49), errorLog] // Keep last 50 errors
    }));

    // Show user-friendly error toast for critical errors
    if (!error.message.includes('ResizeObserver') && !error.message.includes('Non-Error')) {
      toast({
        title: 'Something went wrong',
        description: 'We\'ve logged this issue and will look into it.',
        variant: 'destructive'
      });
    }
  }, []);

  // Monitor Web Vitals
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            trackMetric('LCP', entry.startTime, 'timing', { threshold: entry.startTime > 2500 ? 'poor' : entry.startTime > 1200 ? 'needs-improvement' : 'good' });
            break;
          case 'first-input':
            const fid = (entry as any).processingStart - entry.startTime;
            trackMetric('FID', fid, 'timing', { threshold: fid > 300 ? 'poor' : fid > 100 ? 'needs-improvement' : 'good' });
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              trackMetric('CLS', (entry as any).value, 'timing', { threshold: (entry as any).value > 0.25 ? 'poor' : (entry as any).value > 0.1 ? 'needs-improvement' : 'good' });
            }
            break;
          case 'navigation':
            const navEntry = entry as PerformanceNavigationTiming;
            trackMetric('Page Load', navEntry.loadEventEnd - navEntry.fetchStart, 'navigation');
            trackMetric('DOM Ready', navEntry.domContentLoadedEventEnd - navEntry.fetchStart, 'navigation');
            break;
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    } catch (e) {
      console.warn('Performance observer not supported');
    }

    return () => observer.disconnect();
  }, [trackMetric]);

  // Monitor memory usage
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setState(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
        }));
      }
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Monitor network status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setState(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    const updateConnectionType = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setState(prev => ({
          ...prev,
          connectionType: connection.effectiveType || 'unknown'
        }));
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    updateConnectionType();
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(event.reason?.message || 'Unhandled Promise Rejection'), {
        reason: event.reason
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackError]);

  const getAverageMetric = (name: string) => {
    const metrics = state.metrics.filter(m => m.name === name);
    return metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length : 0;
  };

  const getErrorRate = () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentErrors = state.errors.filter(e => e.timestamp > oneHourAgo);
    return recentErrors.length;
  };

  return {
    ...state,
    trackMetric,
    trackError,
    getAverageMetric,
    getErrorRate
  };
};
