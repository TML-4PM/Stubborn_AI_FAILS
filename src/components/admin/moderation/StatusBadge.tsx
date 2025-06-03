
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Star } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  isFeatured: boolean;
}

const StatusBadge = ({ status, isFeatured }: StatusBadgeProps) => {
  if (isFeatured) {
    return (
      <Badge className="bg-yellow-500 text-white">
        <Star className="h-3 w-3 mr-1" />
        Featured
      </Badge>
    );
  }
  
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-500 text-white">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
};

export default StatusBadge;
