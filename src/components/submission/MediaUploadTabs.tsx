
import { useState, useEffect } from 'react';
import { Image, Link as LinkIcon, AlertCircle, X, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import ImageUploader from '@/components/ImageUploader';
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation';
import { toast } from '@/hooks/use-toast';

interface MediaUploadTabsProps {
  activeTab: 'image' | 'url';
  setActiveTab: (value: 'image' | 'url') => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
  previewUrl: string | null;
  handleImageChange: (file: File | null) => void;
  handleUrlChange: (url: string) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
}

const MediaUploadTabs = ({
  activeTab,
  setActiveTab,
  imageUrl,
  setImageUrl,
  previewUrl,
  handleImageChange,
  handleUrlChange,
  isSubmitting,
  isSuccess,
  errorMessage
}: MediaUploadTabsProps) => {
  const { showNotification } = useTransitionNavigation();
  const [urlPreviewError, setUrlPreviewError] = useState(false);

  // Reset URL preview error when URL changes
  useEffect(() => {
    if (imageUrl) {
      setUrlPreviewError(false);
    }
  }, [imageUrl]);

  const handleImageError = () => {
    setUrlPreviewError(true);
    toast({
      title: "Error",
      description: "Failed to load image from URL. Please check the URL and try again.",
      variant: "destructive",
    });
  };

  return (
    <Tabs 
      defaultValue="image" 
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as 'image' | 'url')}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="image" className="flex items-center justify-center" disabled={isSubmitting || isSuccess}>
          <Image className="w-4 h-4 mr-2" />
          <span>Upload Image</span>
        </TabsTrigger>
        <TabsTrigger value="url" className="flex items-center justify-center" disabled={isSubmitting || isSuccess}>
          <LinkIcon className="w-4 h-4 mr-2" />
          <span>Submit URL</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="image" className="pt-4">
        <ImageUploader 
          onImageChange={handleImageChange}
          previewUrl={activeTab === 'image' ? previewUrl : null}
          isSubmitting={isSubmitting}
          errorMessage={activeTab === 'image' ? errorMessage : null}
        />
      </TabsContent>
      <TabsContent value="url" className="pt-4">
        <div className="space-y-2">
          <label htmlFor="image-url" className="text-sm font-medium flex items-center">
            Enter URL <span className="text-red-500 ml-1">*</span>
            <div className="ml-2 cursor-help group relative">
              <Info className="h-4 w-4 text-muted-foreground" />
              <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-popover rounded-md shadow-md text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Paste a direct link to an image, screenshot, or webpage
              </div>
            </div>
          </label>
          <Input
            id="image-url"
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              handleUrlChange(e.target.value);
            }}
            placeholder="https://example.com/your-ai-fail.jpg"
            className="w-full"
            disabled={isSubmitting || isSuccess}
          />
          {(errorMessage && activeTab === 'url') || urlPreviewError ? (
            <div className="text-sm text-destructive flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{urlPreviewError 
                ? "Failed to load image from URL. Please check the URL and try again." 
                : errorMessage}</span>
            </div>
          ) : null}
          {previewUrl && activeTab === 'url' && (
            <div className="mt-4 border border-border rounded-lg overflow-hidden">
              <div className="aspect-video w-full relative">
                {!urlPreviewError && (
                  <img 
                    src={previewUrl} 
                    alt="URL Preview" 
                    className="w-full h-full object-contain"
                    onError={handleImageError}
                    id="url-preview"
                  />
                )}
                {urlPreviewError && (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-destructive">
                    <AlertCircle className="w-10 h-10 mb-2" />
                    <p className="text-center font-medium">Failed to load image from URL</p>
                    <p className="text-center text-sm text-muted-foreground">Please check that the URL is correct and points to an accessible image</p>
                    <button
                      type="button"
                      onClick={() => {
                        setUrlPreviewError(false);
                        // Force reload the image by adding timestamp
                        handleUrlChange(imageUrl + (imageUrl.includes('?') ? '&' : '?') + 'ts=' + Date.now());
                      }}
                      className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {!isSubmitting && !urlPreviewError && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setImageUrl('');
                      handleUrlChange('');
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MediaUploadTabs;
