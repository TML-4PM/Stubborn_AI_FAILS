
import { cn } from '@/lib/utils';

interface EnhancedSkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
  width?: string;
  height?: string;
  animated?: boolean;
}

const EnhancedSkeleton = ({
  className,
  variant = 'default',
  lines = 1,
  width,
  height,
  animated = true
}: EnhancedSkeletonProps) => {
  const baseClasses = cn(
    'bg-muted rounded',
    animated && 'animate-pulse',
    className
  );

  const variants = {
    default: 'h-4 w-full',
    card: 'h-48 w-full',
    text: 'h-4',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24'
  };

  const variantClasses = variants[variant];

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variantClasses,
              i === lines - 1 && 'w-3/4' // Last line is shorter
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variantClasses)}
      style={{ width, height }}
    />
  );
};

export default EnhancedSkeleton;
