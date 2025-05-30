
/**
 * SEO optimization utilities
 */

export interface SEOMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

/**
 * Updates document head with SEO metadata
 */
export const updateSEOMetadata = (metadata: SEOMetadata) => {
  // Update title
  document.title = metadata.title;

  // Update or create meta tags
  const updateMetaTag = (property: string, content: string) => {
    let element = document.querySelector(`meta[property="${property}"]`) ||
                  document.querySelector(`meta[name="${property}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      if (property.startsWith('og:') || property.startsWith('twitter:')) {
        element.setAttribute('property', property);
      } else {
        element.setAttribute('name', property);
      }
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  };

  // Basic SEO
  updateMetaTag('description', metadata.description);
  
  // Open Graph
  updateMetaTag('og:title', metadata.title);
  updateMetaTag('og:description', metadata.description);
  updateMetaTag('og:type', metadata.type || 'website');
  
  if (metadata.image) {
    updateMetaTag('og:image', metadata.image);
  }
  
  if (metadata.url) {
    updateMetaTag('og:url', metadata.url);
  }

  // Twitter Cards
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', metadata.title);
  updateMetaTag('twitter:description', metadata.description);
  
  if (metadata.image) {
    updateMetaTag('twitter:image', metadata.image);
  }

  // Article-specific
  if (metadata.type === 'article') {
    if (metadata.publishedTime) {
      updateMetaTag('article:published_time', metadata.publishedTime);
    }
    if (metadata.modifiedTime) {
      updateMetaTag('article:modified_time', metadata.modifiedTime);
    }
    if (metadata.author) {
      updateMetaTag('article:author', metadata.author);
    }
    if (metadata.tags) {
      metadata.tags.forEach(tag => {
        const tagElement = document.createElement('meta');
        tagElement.setAttribute('property', 'article:tag');
        tagElement.setAttribute('content', tag);
        document.head.appendChild(tagElement);
      });
    }
  }
};

/**
 * Generates structured data (JSON-LD)
 */
export const generateStructuredData = (type: 'WebSite' | 'ImageGallery' | 'Article', data: any) => {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };

  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(baseStructure);
  document.head.appendChild(script);
};

/**
 * Creates a sitemap entry
 */
export const createSitemapEntry = (url: string, lastmod?: string, priority?: number) => {
  return {
    url,
    lastmod: lastmod || new Date().toISOString().split('T')[0],
    priority: priority || 0.5,
    changefreq: 'weekly'
  };
};

/**
 * Preloads critical resources
 */
export const preloadCriticalResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.includes('.css')) {
      link.as = 'style';
    } else if (resource.includes('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
      link.as = 'image';
    }
    
    document.head.appendChild(link);
  });
};
