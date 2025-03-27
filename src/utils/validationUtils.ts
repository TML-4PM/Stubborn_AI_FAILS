
/**
 * Validation utilities for form submissions
 */

/**
 * Validates if a string is a properly formatted URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Checks if a URL is pointing to an image by its extension
 * This is a simple check and not foolproof
 */
export const isImageUrl = (url: string): boolean => {
  const lowerUrl = url.toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  return imageExtensions.some(ext => lowerUrl.endsWith(ext));
};

/**
 * Validates submission form data
 * @returns True if valid, false otherwise
 */
export const validateSubmissionForm = (
  title: string, 
  imageFile: File | null, 
  imageUrl: string,
  setErrorMessage: (message: string | null) => void,
  showToast: (title: string, description: string, variant: "default" | "destructive") => void
): boolean => {
  if (!title.trim()) {
    setErrorMessage("Please provide a title for your submission");
    showToast(
      "Title required",
      "Please provide a title for your submission",
      "destructive"
    );
    return false;
  }

  if (!imageFile && !imageUrl) {
    setErrorMessage("Please upload an image or provide a URL of your AI fail");
    showToast(
      "Image or URL required",
      "Please upload an image or provide a URL of your AI fail",
      "destructive"
    );
    return false;
  }

  if (imageUrl) {
    if (!isValidUrl(imageUrl)) {
      setErrorMessage("Please provide a valid URL");
      showToast(
        "Invalid URL",
        "Please provide a valid URL",
        "destructive"
      );
      return false;
    }
    
    // Optional: Consider if the URL looks like an image URL
    // if (!isImageUrl(imageUrl)) {
    //   setErrorMessage("URL doesn't appear to be an image. Please check if it's a direct link to an image file.");
    //   showToast(
    //     "Invalid image URL",
    //     "URL doesn't appear to be an image. Please check if it's a direct link to an image file.",
    //     "destructive"
    //   );
    //   return false;
    // }
  }

  setErrorMessage(null);
  return true;
};
