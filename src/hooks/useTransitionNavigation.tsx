
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useTransitionNavigation = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextRoute, setNextRoute] = useState<string | null>(null);

  const transitionTo = useCallback((route: string) => {
    setIsTransitioning(true);
    setNextRoute(route);
    
    // Play transition animation
    document.body.classList.add('page-transition-exit-active');
    
    // Small delay to allow animation to play
    setTimeout(() => {
      navigate(route);
    }, 300);
  }, [navigate]);

  useEffect(() => {
    if (!isTransitioning) return;

    const handleTransitionEnd = () => {
      document.body.classList.remove('page-transition-exit-active');
      document.body.classList.add('page-transition-enter-active');
      setIsTransitioning(false);
    };

    if (nextRoute !== null) {
      // Add event listener for transition end
      document.body.addEventListener('transitionend', handleTransitionEnd, { once: true });
      
      // Fallback in case transition event doesn't fire
      const timeout = setTimeout(() => {
        handleTransitionEnd();
      }, 500);

      return () => {
        document.body.removeEventListener('transitionend', handleTransitionEnd);
        clearTimeout(timeout);
      };
    }
  }, [isTransitioning, nextRoute]);

  useEffect(() => {
    // Add initial enter animation when component mounts
    document.body.classList.add('page-transition-enter');
    
    // Start animation after a small delay
    setTimeout(() => {
      document.body.classList.add('page-transition-enter-active');
      document.body.classList.remove('page-transition-enter');
    }, 10);

    return () => {
      document.body.classList.remove('page-transition-enter-active');
    };
  }, []);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    toast({
      title: type === 'success' ? "Success" : "Error",
      description: message,
      variant: type === 'success' ? "default" : "destructive",
    });
  }, []);

  return { transitionTo, isTransitioning, showNotification };
};
