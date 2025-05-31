
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

export const usePerformanceMonitoring = () => {
  const measurePerformance = useCallback((name: string, fn: () => void | Promise<void>) => {
    const startTime = performance.now();
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
        
        // Log slow operations
        if (duration > 100) {
          console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
        }
      });
    } else {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      
      if (duration > 100) {
        console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    }
  }, []);

  const trackWebVitals = useCallback(() => {
    if ('web-vital' in window) {
      // Track Core Web Vitals if available
      return;
    }
    
    // Basic performance tracking
    window.addEventListener('load', () => {
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        loadTime: navTiming.loadEventEnd - navTiming.fetchStart,
        domReady: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
        firstPaint: 0,
        firstContentfulPaint: 0
      };
      
      // Get paint metrics
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          metrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
      });
      
      console.log('Performance Metrics:', metrics);
    });
  }, []);

  useEffect(() => {
    trackWebVitals();
  }, [trackWebVitals]);

  return { measurePerformance };
};
