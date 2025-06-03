
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedSubmission {
  id?: string;
  title: string;
  description: string;
  username: string;
  image_url: string;
  tags?: string[];
  submission_notes?: string;
  user_id?: string;
}

/**
 * Enhanced submission utility with Supabase Storage integration
 */
export const submitToSupabase = async (
  title: string,
  description: string,
  username: string,
  imageFile: File | null,
  imageUrl: string,
  isUrl: boolean,
  userId?: string,
  tags: string[] = [],
  submissionNotes?: string
): Promise<void> => {
  let finalImageUrl = '';

  try {
    if (isUrl) {
      // If it's a URL submission, use the URL directly
      finalImageUrl = imageUrl;
    } else if (imageFile) {
      // Upload image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId || 'anonymous'}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ai-fail-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image. Please try again.');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ai-fail-images')
        .getPublicUrl(fileName);

      finalImageUrl = publicUrl;
    }

    // Create submission in database
    const submissionData = {
      title,
      description,
      category: 'User Submitted',
      image_url: finalImageUrl,
      user_id: userId,
      status: 'pending',
      review_status: 'pending',
      tags: tags,
      submission_notes: submissionNotes,
      source_platform: 'user_submission',
      auto_generated: false,
      confidence_score: 1.0
    };

    const { data, error } = await supabase
      .from('oopsies')
      .insert(submissionData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to submit AI fail. Please try again.');
    }

    console.log('Submission successful:', data);
  } catch (error: any) {
    console.error('Submission error:', error);
    throw new Error(error.message || 'Failed to submit AI fail. Please try again.');
  }
};

/**
 * Get submissions for a specific user
 */
export const getUserSubmissions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('oopsies')
      .select(`
        id,
        title,
        description,
        image_url,
        status,
        review_status,
        is_featured,
        likes,
        comments,
        view_count,
        created_at,
        tags,
        submission_notes,
        moderation_notes
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    throw error;
  }
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
  }

  return true;
};

/**
 * Extract and validate tags from input
 */
export const processTags = (tagsInput: string): string[] => {
  if (!tagsInput.trim()) return [];
  
  return tagsInput
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && tag.length <= 20)
    .slice(0, 10); // Limit to 10 tags
};

/**
 * Track content analytics
 */
export const trackContentEvent = async (
  oopsieId: string,
  eventType: 'view' | 'like' | 'share' | 'comment',
  userId?: string,
  metadata: Record<string, any> = {}
) => {
  try {
    const { error } = await supabase
      .from('content_analytics')
      .insert({
        oopsie_id: oopsieId,
        event_type: eventType,
        user_id: userId,
        metadata
      });

    if (error) {
      console.error('Error tracking event:', error);
    }

    // Also increment view count if it's a view event
    if (eventType === 'view') {
      await supabase.rpc('increment_view_count', { oopsie_id: oopsieId });
    }
  } catch (error) {
    console.error('Error tracking content event:', error);
  }
};
