
import { Upload, AlertCircle } from 'lucide-react';

interface ImageUploadEmptyProps {
  errorMessage: string | null;
}

const ImageUploadEmpty = ({ errorMessage }: ImageUploadEmptyProps) => {
  return (
    <div className="space-y-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Upload className="w-6 h-6 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          Drag and drop an image, or <span className="text-primary">browse</span>
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG or GIF, max 5MB
        </p>
      </div>
      
      {errorMessage && (
        <div className="mt-4 text-sm text-destructive flex items-center justify-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ImageUploadEmpty;
