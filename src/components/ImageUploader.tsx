
import { useState, useEffect } from 'react';
import { Upload, Info, X, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  const [imageError, setImageError] = useState(false);
  
  // Reset image error state when preview changes
  useEffect(() => {
    setImageError(false);
  }, [previewUrl]);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    validateAndProcessFile(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndProcessFile(file);
  };

  const handleImageError = () => {
    setImageError(true);
    toast({
      title: "Image preview failed",
      description: "We couldn't preview this image. Please try a different one or check the URL.",
      variant: "destructive",
    });
  };
  
  const validateAndProcessFile = (file?: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    onImageChange(file);
  };

  const retryUpload = () => {
    if (previewUrl) {
      setImageError(false);
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
      <div 
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center block cursor-pointer transition-all',
          isDragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'hover:border-muted-foreground/50',
          previewUrl ? 'border-primary/50 bg-primary/5' : 'border-muted',
          errorMessage ? 'border-destructive/50 bg-destructive/5' : '',
          isSubmitting ? 'pointer-events-none opacity-70' : ''
        )}
      >
        <label htmlFor="image" className={cn("cursor-pointer block", isSubmitting ? "pointer-events-none" : "")}>
          {previewUrl ? (
            <div className="relative w-full aspect-video mx-auto">
              {imageError ? (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-destructive">
                  <AlertCircle className="w-12 h-12" />
                  <p className="text-sm font-medium">Failed to load image</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      retryUpload();
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-contain rounded-lg"
                  onError={handleImageError}
                />
              )}
              
              {!isSubmitting && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onImageChange(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Drag and drop an image, or <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or GIF, max 5MB
                </p>
              </div>
              
              {errorMessage && (
                <div className="mt-4 text-sm text-destructive flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errorMessage}
                </div>
              )}
            </div>
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
      </div>
    </div>
  );
};

export default ImageUploader;
