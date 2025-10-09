import { useState, useEffect } from 'react';
import { ExternalLink, Youtube, Link as LinkIcon, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchUrlMetadata, getPlatformName, type UrlMetadata, type ContentType } from '@/utils/urlDetection';

interface SmartUrlPreviewProps {
  url: string;
  onUrlChange: (url: string) => void;
  onMetadataFetched: (contentType: ContentType, metadata: UrlMetadata) => void;
  disabled?: boolean;
}

const SmartUrlPreview = ({ url, onUrlChange, onMetadataFetched, disabled }: SmartUrlPreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [metadata, setMetadata] = useState<UrlMetadata>({});
  const [imageError, setImageError] = useState(false);

  // Fetch metadata when URL changes (with debounce)
  useEffect(() => {
    if (!url || url.length < 10) {
      setContentType(null);
      setMetadata({});
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      setImageError(false);

      try {
        const result = await fetchUrlMetadata(url);
        setContentType(result.contentType);
        setMetadata(result.metadata);
        onMetadataFetched(result.contentType, result.metadata);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch URL metadata');
        setContentType(null);
        setMetadata({});
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [url]);

  const handleRetry = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    setImageError(false);

    try {
      const result = await fetchUrlMetadata(url);
      setContentType(result.contentType);
      setMetadata(result.metadata);
      onMetadataFetched(result.contentType, result.metadata);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch URL metadata');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => {
    if (!contentType || !metadata) return null;

    // Image preview
    if (contentType === 'image') {
      return (
        <div className="border rounded-lg overflow-hidden">
          {!imageError ? (
            <img
              src={url}
              alt="URL Preview"
              className="w-full h-48 object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Unable to load image</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Video preview
    if (contentType === 'video' && metadata.embedUrl) {
      return (
        <div className="border rounded-lg overflow-hidden">
          <div className="aspect-video bg-black relative group">
            {metadata.thumbnail && !imageError ? (
              <>
                <img
                  src={metadata.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Youtube className="w-8 h-8 text-red-600" />
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Youtube className="w-12 h-12 text-white/60 mx-auto mb-2" />
                  <p className="text-sm text-white/60">{getPlatformName(url)} Video</p>
                </div>
              </div>
            )}
          </div>
          {metadata.title && (
            <div className="p-3 bg-muted/50">
              <p className="text-sm font-medium line-clamp-2">{metadata.title}</p>
              {metadata.siteName && (
                <p className="text-xs text-muted-foreground mt-1">{metadata.siteName}</p>
              )}
            </div>
          )}
        </div>
      );
    }

    // Article/Social preview
    if (contentType === 'article' || contentType === 'social') {
      return (
        <div className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
          {metadata.thumbnail && !imageError && (
            <img
              src={metadata.thumbnail}
              alt="Link preview"
              className="w-full h-32 object-cover"
              onError={() => setImageError(true)}
            />
          )}
          <div className="p-4">
            <div className="flex items-start gap-2">
              <LinkIcon className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {metadata.title && (
                  <h4 className="font-medium line-clamp-2 mb-1">{metadata.title}</h4>
                )}
                {metadata.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {metadata.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {metadata.siteName && <span>{metadata.siteName}</span>}
                  {metadata.author && (
                    <>
                      <span>•</span>
                      <span>{metadata.author}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="url-input">URL</Label>
        <div className="relative mt-1.5">
          <Input
            id="url-input"
            type="url"
            placeholder="https://example.com/ai-fail-article"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={disabled}
            className="pr-10"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
          {!isLoading && contentType && (
            <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Paste any URL: images, videos, articles, or social media posts
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="ml-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="border rounded-lg p-8">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Fetching metadata...</p>
          </div>
        </div>
      )}

      {!isLoading && contentType && renderPreview()}

      {contentType && metadata && (
        <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
          <strong>Detected type:</strong> {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
          {contentType === 'video' && metadata.embedUrl && ' (Embeddable)'}
          {contentType === 'social' && ` from ${getPlatformName(url)}`}
        </div>
      )}
    </div>
  );
};

export default SmartUrlPreview;
