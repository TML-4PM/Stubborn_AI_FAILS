
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username || username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }
  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }
  return { isValid: true };
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 5MB' };
  }
  
  return { isValid: true };
};

export const validateSubmissionData = (data: {
  title: string;
  description: string;
  username: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }
  
  if (data.title && data.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.isValid) {
    errors.push(usernameValidation.error!);
  }
  
  return { isValid: errors.length === 0, errors };
};
