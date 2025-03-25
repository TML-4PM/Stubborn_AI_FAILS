
import { useState } from 'react';
import { Image, Link as LinkIcon, AlertCircle, X, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import ImageUploader from '@/components/ImageUploader';
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation';

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
          {errorMessage && activeTab === 'url' && (
            <div className="text-sm text-destructive flex items-center mt-1">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {previewUrl && activeTab === 'url' && (
            <div className="mt-4 border border-border rounded-lg overflow-hidden">
              <div className="aspect-video w-full relative">
                <img 
                  src={previewUrl} 
                  alt="URL Preview" 
                  className="w-full h-full object-contain"
                  onError={() => {
                    showNotification("Failed to load image from URL. Please check the URL and try again.", "error");
                  }}
                  id="url-preview"
                />
                {!isSubmitting && (
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
