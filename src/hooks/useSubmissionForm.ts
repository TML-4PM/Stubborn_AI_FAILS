
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const useSubmissionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    
    setUploadProgress(0);
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your submission",
        variant: "destructive",
      });
      return false;
    }

    if (!imageFile) {
      toast({
        title: "Image required",
        description: "Please upload an image of your AI fail",
        variant: "destructive",
      });
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
      // Generate a unique file name for the image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `fails/${fileName}`;

      setUploadProgress(30);
      
      // Upload image to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('ai-fails')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }

      setUploadProgress(60);

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('ai-fails')
        .getPublicUrl(filePath);

      setUploadProgress(80);

      // Save submission data to Supabase database
      const { error: insertError } = await supabase
        .from('submissions')
        .insert({
          title,
          description,
          username: username || 'Anonymous',
          image_url: publicUrl,
          created_at: new Date().toISOString(),
          status: 'pending' // For moderation purposes
        });

      if (insertError) {
        throw new Error(`Error saving submission: ${insertError.message}`);
      }

      setUploadProgress(100);
      
      // Submission was successful
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Submission received!",
        description: "Your AI fail has been submitted for review.",
      });

      // Reset form after submission
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setUsername('');
        setImageFile(null);
        setPreviewUrl(null);
        setIsSuccess(false);
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setUploadProgress(0);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "There was a problem submitting your AI fail. Please try again.",
        variant: "destructive",
      });
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
    previewUrl,
    isSubmitting,
    isSuccess,
    uploadProgress,
    handleImageChange,
    handleSubmit
  };
};
