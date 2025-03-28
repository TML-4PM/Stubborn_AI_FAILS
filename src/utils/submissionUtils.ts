
import { getAllFails, AIFail, addNewFail } from '@/data/sampleFails';

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
 * Saves submission data to local storage and sample data
 */
export const saveSubmissionToStorage = async (
  title: string,
  description: string,
  username: string,
  imageUrl: string,
  isUrl: boolean,
  userId?: string
): Promise<void> => {
  const submissionData: AIFail = {
    id: crypto.randomUUID(),
    title,
    description,
    username: username || 'Anonymous',
    image: imageUrl,
    timestamp: new Date().toISOString(),
    likes: 0,
    category: 'User Submitted',
    tags: ['user-submitted'],
    status: 'pending'
  };

  try {
    // Add to sample data (in a real app, this would be a backend API call)
    addNewFail(submissionData);
    
    // Also save to localStorage for persistence
    const existingSubmissions = JSON.parse(localStorage.getItem('userSubmissions') || '[]');
    existingSubmissions.push(submissionData);
    localStorage.setItem('userSubmissions', JSON.stringify(existingSubmissions));
    
  } catch (error: any) {
    console.error("Submission error:", error);
    throw new Error("Failed to save submission. Please try again.");
  }
};
