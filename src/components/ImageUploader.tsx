
import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateImageFile } from '@/utils/imageUtils';
import ImageDropzone from '@/components/image/ImageDropzone';
import ImagePreview from '@/components/image/ImagePreview';
import ImageUploadEmpty from '@/components/image/ImageUploadEmpty';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

const ImageUploader = ({ 
  onImageChange, 
  previewUrl, 
  isSubmitting = false,
  errorMessage = null
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Handle file selection from input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndProcessFile(file);
  };
  
  // Process dropped file
  const handleFileDrop = (file: File) => {
    validateAndProcessFile(file);
  };
  
  // Common validation and processing for both drag-drop and file input
  const validateAndProcessFile = (file?: File) => {
    if (!file) return;

    if (validateImageFile(file)) {
      onImageChange(file);
    }
  };

  // Handle retry for image preview errors
  const retryUpload = () => {
    if (previewUrl) {
      // Force preview refresh
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="image" className="text-sm font-medium flex items-center">
        Upload Image <span className="text-red-500 ml-1">*</span>
        <div className="ml-2 cursor-help group relative">
          <Info className="h-4 w-4 text-muted-foreground" />
          <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-popover rounded-md shadow-md text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
            PNG, JPG or GIF, max 5MB
          </div>
        </div>
      </label>
      
      <ImageDropzone 
        onDrop={handleFileDrop}
        isDragging={isDragging}
        disabled={isSubmitting}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center block cursor-pointer transition-all',
          isDragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'hover:border-muted-foreground/50',
          previewUrl ? 'border-primary/50 bg-primary/5' : 'border-muted',
          errorMessage ? 'border-destructive/50 bg-destructive/5' : '',
          isSubmitting ? 'opacity-70' : ''
        )}
      >
        <label htmlFor="image" className={cn("cursor-pointer block", isSubmitting ? "pointer-events-none" : "")}>
          {previewUrl ? (
            <ImagePreview 
              previewUrl={previewUrl}
              onRemove={() => onImageChange(null)}
              onRetry={retryUpload}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ImageUploadEmpty errorMessage={errorMessage} />
          )}
          
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
            disabled={isSubmitting}
          />
        </label>
      </ImageDropzone>
    </div>
  );
};

export default ImageUploader;
