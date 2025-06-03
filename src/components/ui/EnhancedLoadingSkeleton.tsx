
import { cn } from '@/lib/utils';

interface EnhancedLoadingSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'search' | 'leaderboard';
  className?: string;
  count?: number;
}

const EnhancedLoadingSkeleton = ({ 
  variant = 'card', 
  className,
  count = 1 
}: EnhancedLoadingSkeletonProps) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={cn("animate-pulse space-y-4", className)}>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={cn("animate-pulse space-y-2", className)}>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        );
      
      case 'avatar':
        return (
          <div className={cn("animate-pulse flex items-center space-x-3", className)}>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        );
      
      case 'button':
        return (
          <div className={cn("animate-pulse", className)}>
            <div className="h-10 bg-gray-200 rounded-md w-24"></div>
          </div>
        );
      
      case 'search':
        return (
          <div className={cn("animate-pulse space-y-4", className)}>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        );
      
      case 'leaderboard':
        return (
          <div className={cn("animate-pulse space-y-3", className)}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-100">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className={cn("animate-pulse", className)}>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default EnhancedLoadingSkeleton;
