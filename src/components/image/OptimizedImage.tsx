
import ProgressiveImage from '@/components/ui/ProgressiveImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  blur?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  blur = true,
  onLoad,
  onError
}: OptimizedImageProps) => {
  return (
    <ProgressiveImage
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      priority={priority}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default OptimizedImage;
