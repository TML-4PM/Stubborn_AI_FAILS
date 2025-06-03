
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Star } from 'lucide-react';

interface ModerationActionsProps {
  submissionId: string;
  isSelected: boolean;
  onSelect: () => void;
  moderationNotes: string;
  setModerationNotes: (notes: string) => void;
  onModerate: (submissionId: string, action: 'approved' | 'rejected' | 'featured') => void;
  compact?: boolean;
}

const ModerationActions = ({
  submissionId,
  isSelected,
  onSelect,
  moderationNotes,
  setModerationNotes,
  onModerate,
  compact = false
}: ModerationActionsProps) => {
  if (compact) {
    return (
      <div className="flex gap-2">
        <Button 
          size="sm"
          onClick={() => onModerate(submissionId, 'approved')}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onModerate(submissionId, 'featured')}
        >
          <Star className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="destructive"
          onClick={() => onModerate(submissionId, 'rejected')}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (isSelected) {
    return (
      <div className="space-y-2">
        <Textarea
          placeholder="Moderation notes..."
          value={moderationNotes}
          onChange={(e) => setModerationNotes(e.target.value)}
          className="text-xs"
        />
        <div className="flex gap-1">
          <Button 
            size="sm" 
            className="flex-1 text-xs" 
            onClick={() => onModerate(submissionId, 'approved')}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => onModerate(submissionId, 'featured')}
          >
            <Star className="h-3 w-3 mr-1" />
            Feature
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="flex-1 text-xs"
            onClick={() => onModerate(submissionId, 'rejected')}
          >
            <XCircle className="h-3 w-3 mr-1" />
            Reject
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="w-full text-xs"
      onClick={onSelect}
    >
      Moderate
    </Button>
  );
};

export default ModerationActions;
