import { useState, useEffect } from 'react';

export const usePerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+P to toggle
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
        localStorage.setItem('performanceMonitorVisible', (!isVisible).toString());
      }
    };

    // Load saved state
    const saved = localStorage.getItem('performanceMonitorVisible');
    if (saved === 'true') {
      setIsVisible(true);
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  return { isVisible, setIsVisible };
};
