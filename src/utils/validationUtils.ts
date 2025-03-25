
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

  if (imageUrl && !isValidUrl(imageUrl)) {
    setErrorMessage("Please provide a valid URL");
    showToast(
      "Invalid URL",
      "Please provide a valid URL",
      "destructive"
    );
    return false;
  }

  setErrorMessage(null);
  return true;
};
