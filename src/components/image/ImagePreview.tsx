
import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleImagePreviewError } from '@/utils/imageUtils';

interface ImagePreviewProps {
  previewUrl: string;
  onRemove: () => void;
  onRetry: () => void;
  isSubmitting?: boolean;
}

const ImagePreview = ({ 
  previewUrl, 
  onRemove, 
  onRetry,
  isSubmitting = false 
}: ImagePreviewProps) => {
  const [imageError, setImageError] = useState(false);
  
  const handleError = () => {
    setImageError(true);
    handleImagePreviewError();
  };
  
  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageError(false);
    onRetry();
  };

  return (
    <div className="relative w-full aspect-video mx-auto">
      {imageError ? (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-destructive">
          <AlertCircle className="w-12 h-12" />
          <p className="text-sm font-medium">Failed to load image</p>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleRetry}
          >
            Retry
          </Button>
        </div>
      ) : (
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="w-full h-full object-contain rounded-lg"
          onError={handleError}
        />
      )}
      
      {!isSubmitting && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
          aria-label="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ImagePreview;
