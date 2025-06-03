
import { Card, CardContent } from '@/components/ui/card';
import { PendingSubmission } from './types';
import StatusBadge from './StatusBadge';
import ModerationActions from './ModerationActions';

interface ModerationListViewProps {
  submissions: PendingSubmission[];
  onModerate: (submissionId: string, action: 'approved' | 'rejected' | 'featured') => void;
}

const ModerationListView = ({ submissions, onModerate }: ModerationListViewProps) => {
  return (
    <div className="space-y-2">
      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img 
                src={submission.image_url} 
                alt={submission.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{submission.title}</h3>
                  <StatusBadge status={submission.status} isFeatured={submission.is_featured} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {submission.description}
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                  <span>By: {submission.profiles?.username || 'Anonymous'}</span>
                  <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {submission.status === 'pending' && (
                <ModerationActions
                  submissionId={submission.id}
                  isSelected={false}
                  onSelect={() => {}}
                  moderationNotes=""
                  setModerationNotes={() => {}}
                  onModerate={onModerate}
                  compact
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModerationListView;
