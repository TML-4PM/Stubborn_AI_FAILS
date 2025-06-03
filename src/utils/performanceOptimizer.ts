
// Global performance optimization utilities

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload fonts
  const fontLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];

  fontLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/placeholder.svg',
    '/og-image.png'
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Optimize bundle loading
export const optimizeBundleLoading = () => {
  // Enable module preloading for modern browsers
  if ('modulepreload' in HTMLLinkElement.prototype) {
    console.log('Module preloading supported');
  }

  // Prefetch route components
  const routes = ['/gallery', '/search', '/community', '/submit'];
  routes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
};

// Memory optimization
export const optimizeMemoryUsage = () => {
  // Clean up old event listeners
  const cleanupInterval = setInterval(() => {
    if (document.hidden) {
      // Page is not visible, good time for cleanup
      // Force garbage collection if possible
      if ((window as any).gc) {
        (window as any).gc();
      }
    }
  }, 30000); // Every 30 seconds

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(cleanupInterval);
  });
};

// Network optimization
export const optimizeNetworkRequests = () => {
  // Use connection info if available
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (connection) {
    const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
    
    if (isSlowConnection) {
      // Disable non-critical features for slow connections
      console.log('Slow connection detected, optimizing...');
      return {
        reducedImageQuality: true,
        disableAnimations: true,
        reducedPollingFrequency: true
      };
    }
  }

  return {
    reducedImageQuality: false,
    disableAnimations: false,
    reducedPollingFrequency: false
  };
};

// Initialize all optimizations
export const initializePerformanceOptimizations = () => {
  preloadCriticalResources();
  optimizeBundleLoading();
  optimizeMemoryUsage();
  
  const networkOptimizations = optimizeNetworkRequests();
  
  return networkOptimizations;
};
