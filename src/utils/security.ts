
import DOMPurify from 'dompurify';

interface CSPConfig {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'connect-src': string[];
  'font-src': string[];
  'frame-src': string[];
  'media-src': string[];
}

// Content Security Policy configuration
export const cspConfig: CSPConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "https://cdn.gpteng.co",
    "https://www.gstatic.com",
    "https://www.google.com"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for dynamic styles
    "https://fonts.googleapis.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "blob:",
    "https:",
    "https://*.supabase.co",
    "https://images.unsplash.com"
  ],
  'connect-src': [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://api.stripe.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'frame-src': [
    "'self'",
    "https://www.google.com"
  ],
  'media-src': [
    "'self'",
    "blob:",
    "https:"
  ]
};

// Generate CSP header string
export const generateCSPHeader = (): string => {
  return Object.entries(cspConfig)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// Input sanitization utilities
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false
  });
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .trim()
    .substring(0, 10000); // Limit length
};

export const sanitizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    return parsedUrl.toString();
  } catch {
    return '';
  }
};

// Rate limiting for client-side protection
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Validate file uploads
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, WebP, and GIF files are allowed' };
  }
  
  return { isValid: true };
};

// Secure localStorage wrapper
export const secureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const sanitizedValue = typeof value === 'string' ? sanitizeText(value) : value;
      localStorage.setItem(key, JSON.stringify(sanitizedValue));
    } catch (error) {
      console.error('Failed to store item securely:', error);
    }
  },
  
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to retrieve item securely:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item securely:', error);
    }
  }
};

// XSS protection for dynamic content
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
