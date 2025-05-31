
import { useState, useEffect, useCallback } from 'react';
import { useUserPreferencesStore } from '@/store/useUserPreferencesStore';

interface AccessibilityState {
  isHighContrast: boolean;
  isReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  isScreenReaderActive: boolean;
  focusMode: boolean;
}

export const useAccessibility = () => {
  const { preferences, updatePreferences } = useUserPreferencesStore();
  const [state, setState] = useState<AccessibilityState>({
    isHighContrast: preferences.accessibility.highContrast,
    isReducedMotion: preferences.accessibility.reducedMotion,
    fontSize: preferences.accessibility.fontSize,
    isScreenReaderActive: preferences.accessibility.screenReader,
    focusMode: false
  });

  // Detect system preferences
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');

    const updateMotionPreference = () => {
      if (!preferences.accessibility.reducedMotion) {
        setState(prev => ({ ...prev, isReducedMotion: prefersReducedMotion.matches }));
      }
    };

    const updateContrastPreference = () => {
      if (!preferences.accessibility.highContrast) {
        setState(prev => ({ ...prev, isHighContrast: prefersHighContrast.matches }));
      }
    };

    updateMotionPreference();
    updateContrastPreference();

    prefersReducedMotion.addEventListener('change', updateMotionPreference);
    prefersHighContrast.addEventListener('change', updateContrastPreference);

    return () => {
      prefersReducedMotion.removeEventListener('change', updateMotionPreference);
      prefersHighContrast.removeEventListener('change', updateContrastPreference);
    };
  }, [preferences.accessibility]);

  // Apply accessibility styles
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${state.fontSize}`);
    
    // High contrast
    if (state.isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (state.isReducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Focus mode
    if (state.focusMode) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }
  }, [state]);

  // Keyboard navigation helpers
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    // Skip to main content with Alt+M
    if (event.altKey && event.key === 'm') {
      event.preventDefault();
      const main = document.querySelector('main');
      if (main) {
        main.focus();
        main.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    // Toggle focus mode with Alt+F
    if (event.altKey && event.key === 'f') {
      event.preventDefault();
      setState(prev => ({ ...prev, focusMode: !prev.focusMode }));
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => document.removeEventListener('keydown', handleKeyboardNavigation);
  }, [handleKeyboardNavigation]);

  // Screen reader announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Focus management
  const focusFirstElement = useCallback((container?: HTMLElement) => {
    const focusableElements = (container || document).querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, []);

  const updateAccessibilityPreference = useCallback((key: keyof AccessibilityState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
    
    // Update persistent preferences
    if (key !== 'focusMode') {
      updatePreferences({
        accessibility: {
          ...preferences.accessibility,
          [key === 'isHighContrast' ? 'highContrast' : 
           key === 'isReducedMotion' ? 'reducedMotion' :
           key === 'isScreenReaderActive' ? 'screenReader' : key]: value
        }
      });
    }
  }, [preferences.accessibility, updatePreferences]);

  return {
    ...state,
    announce,
    focusFirstElement,
    trapFocus,
    updateAccessibilityPreference
  };
};
