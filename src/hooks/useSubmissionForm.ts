
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { validateSubmissionForm } from '@/utils/validationUtils';
import { uploadFileToStorage } from '@/utils/uploadUtils';
import { saveSubmissionToStorage, UserSubmission } from '@/utils/submissionUtils';

export const useSubmissionForm = () => {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUrl, setIsUrl] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set username from user if available
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setIsUrl(false);
    setErrorMessage(null);
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageUrl('');
    } else {
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
    }
    
    setUploadProgress(0);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSubmissionForm(title, imageFile, imageUrl, setErrorMessage, showToast)) return;

    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      let finalImageUrl = '';
      
      if (isUrl) {
        // If it's a URL submission, use the URL directly
        finalImageUrl = imageUrl;
        setUploadProgress(60);
      } else if (imageFile) {
        // Upload image to Firebase Storage
        finalImageUrl = await uploadFileToStorage(imageFile, setUploadProgress);
      }

      setUploadProgress(80);

      // Save submission data
      await saveSubmissionToStorage(
        title,
        description,
        username,
        finalImageUrl,
        isUrl,
        user?.id
      );

      setUploadProgress(100);
      
      // Submission was successful
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast(
        "Submission received!",
        "Your AI fail has been submitted for review."
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
    handleSubmit,
    resetForm,
    isUserLoggedIn: !!user
  };
};
