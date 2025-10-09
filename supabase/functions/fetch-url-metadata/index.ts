import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UrlMetadata {
  contentType: 'image' | 'video' | 'article' | 'social';
  metadata: {
    title?: string;
    description?: string;
    thumbnail?: string;
    embedUrl?: string;
    siteName?: string;
    author?: string;
  };
}

// Detect URL type based on patterns
function detectUrlType(url: string): 'image' | 'video' | 'article' | 'social' {
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

// Extract YouTube video ID and create embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  
  return null;
}

// Extract TikTok video ID and create embed URL
function getTikTokEmbedUrl(url: string): string | null {
  const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
  if (match && match[1]) {
    return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }
  return null;
}

// Extract Vimeo video ID and create embed URL
function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }
  return null;
}

// Extract metadata from HTML
function extractMetadata(html: string, url: string): UrlMetadata['metadata'] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  if (!doc) {
    return {};
  }
  
  const metadata: UrlMetadata['metadata'] = {};
  
  // Extract Open Graph tags (priority)
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const ogSiteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
  
  // Extract Twitter Card tags (fallback)
  const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
  const twitterDescription = doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
  const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
  
  // Extract standard meta tags (last resort)
  const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content');
  const pageTitle = doc.querySelector('title')?.textContent;
  const metaAuthor = doc.querySelector('meta[name="author"]')?.getAttribute('content');
  
  // Build metadata object with priority
  metadata.title = ogTitle || twitterTitle || pageTitle || '';
  metadata.description = ogDescription || twitterDescription || metaDescription || '';
  metadata.thumbnail = ogImage || twitterImage || '';
  metadata.siteName = ogSiteName || new URL(url).hostname;
  metadata.author = metaAuthor || '';
  
  return metadata;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching metadata for: ${url}`);

    // Detect content type
    const contentType = detectUrlType(url);
    console.log(`Detected content type: ${contentType}`);

    let result: UrlMetadata = {
      contentType,
      metadata: {}
    };

    // For images, just return the URL
    if (contentType === 'image') {
      result.metadata = {
        thumbnail: url,
        title: 'Image',
        description: ''
      };
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For videos, extract embed URL
    if (contentType === 'video') {
      let embedUrl: string | null = null;
      
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        embedUrl = getYouTubeEmbedUrl(url);
      } else if (url.includes('tiktok.com')) {
        embedUrl = getTikTokEmbedUrl(url);
      } else if (url.includes('vimeo.com')) {
        embedUrl = getVimeoEmbedUrl(url);
      }
      
      result.metadata.embedUrl = embedUrl || '';
    }

    // Fetch the URL to extract metadata
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AIFailsBot/1.0)'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status}`);
      }

      const html = await response.text();
      const extractedMetadata = extractMetadata(html, url);
      
      // Merge extracted metadata with result
      result.metadata = {
        ...result.metadata,
        ...extractedMetadata
      };

      console.log(`Successfully extracted metadata for: ${url}`);

    } catch (fetchError) {
      console.error('Error fetching URL:', fetchError);
      
      // Return basic metadata if fetch fails
      result.metadata = {
        title: url,
        description: 'Unable to fetch metadata',
        thumbnail: '',
        siteName: new URL(url).hostname
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-url-metadata:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
