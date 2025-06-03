
import { Card, CardContent } from '@/components/ui/card';
import { PendingSubmission } from './types';
import StatusBadge from './StatusBadge';
import ModerationActions from './ModerationActions';

interface ModerationGridViewProps {
  submissions: PendingSubmission[];
  selectedSubmission: string | null;
  setSelectedSubmission: (id: string | null) => void;
  moderationNotes: string;
  setModerationNotes: (notes: string) => void;
  onModerate: (submissionId: string, action: 'approved' | 'rejected' | 'featured') => void;
}

const ModerationGridView = ({
  submissions,
  selectedSubmission,
  setSelectedSubmission,
  moderationNotes,
  setModerationNotes,
  onModerate
}: ModerationGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {submissions.map((submission) => (
        <Card key={submission.id} className="overflow-hidden">
          <div className="aspect-video overflow-hidden">
            <img 
              src={submission.image_url} 
              alt={submission.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-sm line-clamp-1">{submission.title}</h3>
              <StatusBadge status={submission.status} isFeatured={submission.is_featured} />
            </div>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {submission.description}
            </p>
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
              <span>By: {submission.profiles?.username || 'Anonymous'}</span>
              <span>{new Date(submission.created_at).toLocaleDateString()}</span>
            </div>
            
            {submission.status === 'pending' && (
              <ModerationActions
                submissionId={submission.id}
                isSelected={selectedSubmission === submission.id}
                onSelect={() => setSelectedSubmission(submission.id)}
                moderationNotes={moderationNotes}
                setModerationNotes={setModerationNotes}
                onModerate={onModerate}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModerationGridView;
