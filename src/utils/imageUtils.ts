
import { toast } from '@/hooks/use-toast';

/**
 * Validates an image file for size and type restrictions
 * @param file The file to validate
 * @returns True if the file is valid, false otherwise
 */
export const validateImageFile = (file?: File): boolean => {
  if (!file) return false;

  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "File too large",
      description: "Please select an image smaller than 5MB",
      variant: "destructive",
    });
    return false;
  }

  if (!file.type.startsWith('image/')) {
    toast({
      title: "Invalid file type",
      description: "Please select an image file",
      variant: "destructive",
    });
    return false;
  }

  return true;
};

/**
 * Shows a toast notification for image preview error
 */
export const handleImagePreviewError = (): void => {
  toast({
    title: "Image preview failed",
    description: "We couldn't preview this image. Please try a different one or check the URL.",
    variant: "destructive",
  });
};
