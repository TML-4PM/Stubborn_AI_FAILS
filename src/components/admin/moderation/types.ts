
export interface PendingSubmission {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: string;
  created_at: string;
  user_id: string;
  submission_notes?: string;
  is_featured: boolean;
  profiles?: { username: string } | null;
}

export interface ModerationAction {
  submissionId: string;
  action: 'approved' | 'rejected' | 'featured';
  notes?: string;
}
