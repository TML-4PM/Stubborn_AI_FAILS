
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Uploads a file to Firebase Storage and tracks progress
 * @returns The download URL of the uploaded file
 */
export const uploadFileToStorage = async (
  file: File,
  setUploadProgress: (progress: number) => void
): Promise<string> => {
  const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
  const storageRef = ref(storage, `fails/${fileName}`);
  
  const uploadTask = uploadBytesResumable(storageRef, file);
  
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
        // Add more specific error handling for permission issues
        if (error.code === 'storage/unauthorized') {
          reject(new Error('Permission denied. Please check your Firebase Storage rules.'));
        } else if (error.code === 'storage/canceled') {
          reject(new Error('Upload was canceled.'));
        } else {
          reject(error);
        }
      },
      () => {
        resolve();
      }
    );
  });
  
  try {
    // Get download URL after upload completes
    return await getDownloadURL(uploadTask.snapshot.ref);
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      throw new Error('The uploaded file could not be accessed. Please try again.');
    }
    throw error;
  }
};
