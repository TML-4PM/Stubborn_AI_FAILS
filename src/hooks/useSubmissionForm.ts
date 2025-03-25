
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

export interface UserSubmission {
  id: string;
  title: string;
  description: string;
  username: string;
  image_url: string;
  created_at: string;
  status: string;
  user_id?: string;
  likes?: number;
  is_url?: boolean;
}

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

  // Set username from user if available
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setIsUrl(false);
    
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
    
    if (url) {
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

    if (!imageFile && !imageUrl) {
      toast({
        title: "Image or URL required",
        description: "Please upload an image or provide a URL of your AI fail",
        variant: "destructive",
      });
      return false;
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid URL",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

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
        const fileName = `${uuidv4()}.${imageFile.name.split('.').pop()}`;
        const storageRef = ref(storage, `fails/${fileName}`);
        
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        
        // Monitor upload progress
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setUploadProgress(Math.min(60, 10 + progress / 2)); // Cap at 60% for upload
            },
            (error) => {
              console.error('Upload error:', error);
              reject(error);
            },
            () => {
              resolve();
            }
          );
        });
        
        // Get download URL after upload completes
        finalImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
      }

      setUploadProgress(80);

      // Save submission data to Firestore
      const submissionData = {
        title,
        description,
        username: username || 'Anonymous',
        image_url: finalImageUrl,
        is_url: isUrl,
        created_at: new Date().toISOString(),
        status: 'pending', // For moderation purposes
        user_id: user?.id, // Link to user if logged in
        likes: 0
      };

      await addDoc(collection(db, 'submissions'), submissionData);

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
        if (!user?.username) {
          setUsername('');
        }
        setImageFile(null);
        setImageUrl('');
        setIsUrl(false);
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
    imageUrl,
    setImageUrl,
    isUrl,
    setIsUrl,
    previewUrl,
    isSubmitting,
    isSuccess,
    uploadProgress,
    handleImageChange,
    handleUrlChange,
    handleSubmit,
    isUserLoggedIn: !!user
  };
};
