
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from '@/components/ImageUploader';
import SmartUrlPreview from './SmartUrlPreview';
import { type ContentType, type UrlMetadata } from '@/utils/urlDetection';

interface MediaUploadTabsProps {
  activeTab: 'image' | 'url';
  setActiveTab: (value: 'image' | 'url') => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
  previewUrl: string | null;
  handleImageChange: (file: File | null) => void;
  handleUrlChange: (url: string) => void;
  handleMetadataFetched: (contentType: ContentType, metadata: UrlMetadata) => void;
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
  handleMetadataFetched,
  isSubmitting,
  isSuccess,
  errorMessage
}: MediaUploadTabsProps) => {

  return (
    <Tabs 
      defaultValue="image" 
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as 'image' | 'url')}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="image" disabled={isSubmitting || isSuccess}>
          Upload Image
        </TabsTrigger>
        <TabsTrigger value="url" disabled={isSubmitting || isSuccess}>
          URL
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
        <SmartUrlPreview
          url={imageUrl}
          onUrlChange={handleUrlChange}
          onMetadataFetched={handleMetadataFetched}
          disabled={isSubmitting || isSuccess}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MediaUploadTabs;
