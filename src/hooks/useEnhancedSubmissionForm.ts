
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { submitToSupabase, validateImageFile, processTags } from '@/utils/enhancedSubmissionUtils';
import { type ContentType, type UrlMetadata } from '@/utils/urlDetection';

export const useEnhancedSubmissionForm = () => {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [tags, setTags] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUrl, setIsUrl] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contentType, setContentType] = useState<ContentType>('image');
  const [metadata, setMetadata] = useState<UrlMetadata>({});

  // Set username from user if available
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleImageChange = (file: File | null) => {
    setErrorMessage(null);
    
    if (file) {
      try {
        validateImageFile(file);
        setImageFile(file);
        setIsUrl(false);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setImageUrl('');
      } catch (error: any) {
        setErrorMessage(error.message);
        setImageFile(null);
        setPreviewUrl(null);
      }
    } else {
      setImageFile(null);
      setPreviewUrl(null);
    }
    
    setUploadProgress(0);
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setIsUrl(true);
    setImageFile(null);
    setErrorMessage(null);
    
    if (url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
      setContentType('image');
      setMetadata({});
    }
    
    setUploadProgress(0);
  };

  const handleMetadataFetched = (type: ContentType, meta: UrlMetadata) => {
    setContentType(type);
    setMetadata(meta);
    
    // Auto-fill title and description from metadata if empty
    if (!title && meta.title) {
      setTitle(meta.title);
    }
    if (!description && meta.description) {
      setDescription(meta.description);
    }
  };

  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    toast({
      title,
      description,
      variant,
    });
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTags('');
    setSubmissionNotes('');
    if (!user?.username) {
      setUsername('');
    }
    setImageFile(null);
    setImageUrl('');
    setIsUrl(false);
    setPreviewUrl(null);
    setIsSuccess(false);
    setUploadProgress(0);
    setErrorMessage(null);
    setContentType('image');
    setMetadata({});
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setErrorMessage('Title is required');
      return false;
    }

    if (!description.trim()) {
      setErrorMessage('Description is required');
      return false;
    }

    if (!isUrl && !imageFile) {
      setErrorMessage('Please upload an image or provide a URL');
      return false;
    }

    if (isUrl && !imageUrl.trim()) {
      setErrorMessage('Please provide an image URL');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      const processedTags = processTags(tags);
      setUploadProgress(30);

      await submitToSupabase(
        title.trim(),
        description.trim(),
        username.trim() || 'Anonymous',
        imageFile,
        imageUrl.trim(),
        isUrl,
        user?.id,
        processedTags,
        submissionNotes.trim(),
        contentType,
        metadata
      );

      setUploadProgress(100);
      
      // Submission was successful
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast(
        "Submission received!",
        "Your AI fail has been submitted for review and will be visible once approved."
      );

      // Reset form after submission
      setTimeout(() => {
        resetForm();
      }, 2000);
      
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setUploadProgress(0);
      
      const errorMsg = error instanceof Error ? error.message : "There was a problem submitting your AI fail. Please try again.";
      setErrorMessage(errorMsg);
      
      showToast(
        "Submission failed",
        errorMsg,
        "destructive"
      );
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    username,
    setUsername,
    tags,
    setTags,
    submissionNotes,
    setSubmissionNotes,
    imageFile,
    imageUrl,
    setImageUrl,
    isUrl,
    setIsUrl,
    previewUrl,
    isSubmitting,
    isSuccess,
    uploadProgress,
    errorMessage,
    handleImageChange,
    handleUrlChange,
    handleMetadataFetched,
    handleSubmit,
    resetForm,
    isUserLoggedIn: !!user,
    contentType,
    metadata
  };
};
