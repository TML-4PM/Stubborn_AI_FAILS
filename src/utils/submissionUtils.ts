
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

/**
 * Saves submission data to Firestore
 */
export const saveSubmissionToFirestore = async (
  title: string,
  description: string,
  username: string,
  imageUrl: string,
  isUrl: boolean,
  userId?: string
): Promise<void> => {
  const submissionData = {
    title,
    description,
    username: username || 'Anonymous',
    image_url: imageUrl,
    is_url: isUrl,
    created_at: new Date().toISOString(),
    timestamp: serverTimestamp(), // Server timestamp for accurate sorting
    status: 'pending', // For moderation purposes
    user_id: userId, // Link to user if logged in
    likes: 0
  };

  await addDoc(collection(db, 'submissions'), submissionData);
};
