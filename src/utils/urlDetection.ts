import { supabase } from '@/integrations/supabase/client';

export type ContentType = 'image' | 'video' | 'article' | 'social';

export interface UrlMetadata {
  title?: string;
  description?: string;
  thumbnail?: string;
  embedUrl?: string;
  siteName?: string;
  author?: string;
}

export interface UrlAnalysisResult {
  contentType: ContentType;
  metadata: UrlMetadata;
}

/**
 * Quick client-side URL type detection based on patterns
 */
export function detectUrlType(url: string): ContentType {
  const urlLower = url.toLowerCase();
  
  // Check for image URLs
  if (urlLower.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i)) {
    return 'image';
  }
  
  // Check for video platforms
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be') ||
      urlLower.includes('vimeo.com') || urlLower.includes('tiktok.com')) {
    return 'video';
  }
  
  // Check for social platforms
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com') ||
      urlLower.includes('reddit.com') || urlLower.includes('facebook.com') ||
      urlLower.includes('instagram.com')) {
    return 'social';
  }
  
  // Default to article
  return 'article';
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Fetch metadata from URL using Supabase Edge Function
 */
export async function fetchUrlMetadata(url: string): Promise<UrlAnalysisResult> {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format');
  }

  try {
    const { data, error } = await supabase.functions.invoke('fetch-url-metadata', {
      body: { url }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error('Failed to fetch URL metadata');
    }

    if (!data || !data.contentType) {
      throw new Error('Invalid response from metadata service');
    }

    return {
      contentType: data.contentType,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    
    // Return fallback with detected type
    return {
      contentType: detectUrlType(url),
      metadata: {
        title: url,
        description: 'Unable to fetch metadata',
        thumbnail: detectUrlType(url) === 'image' ? url : '',
        siteName: new URL(url).hostname
      }
    };
  }
}

/**
 * Get platform name from URL
 */
export function getPlatformName(url: string): string {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'YouTube';
  }
  if (urlLower.includes('tiktok.com')) {
    return 'TikTok';
  }
  if (urlLower.includes('vimeo.com')) {
    return 'Vimeo';
  }
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return 'X (Twitter)';
  }
  if (urlLower.includes('reddit.com')) {
    return 'Reddit';
  }
  if (urlLower.includes('facebook.com')) {
    return 'Facebook';
  }
  if (urlLower.includes('instagram.com')) {
    return 'Instagram';
  }
  
  return 'Web';
}
