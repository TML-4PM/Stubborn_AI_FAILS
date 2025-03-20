
import { useState } from 'react';
import { Upload, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
}

const ImageUploader = ({ onImageChange, previewUrl }: ImageUploaderProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      <label 
        htmlFor="image" 
        className={`border-2 border-dashed rounded-lg p-8 text-center block cursor-pointer transition-colors ${
          previewUrl ? 'border-primary/50 bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
        }`}
      >
        {previewUrl ? (
          <div className="relative w-full aspect-video mx-auto">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onImageChange(null);
              }}
              className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
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
          </div>
        )}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="sr-only"
          required={!previewUrl}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
