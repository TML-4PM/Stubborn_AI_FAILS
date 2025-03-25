
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isSuccess: boolean;
  uploadProgress: number;
  isFormValid: boolean;
}

const SubmitButton = ({ 
  isSubmitting, 
  isSuccess, 
  uploadProgress,
  isFormValid
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting || isSuccess || !isFormValid}
      className="w-full h-12 relative overflow-hidden"
      variant={isSuccess ? "secondary" : "default"}
    >
      {isSubmitting && uploadProgress < 100 && (
        <div 
          className="absolute left-0 bottom-0 h-1 bg-primary-foreground/30"
          style={{ width: `${uploadProgress}%` }}
        />
      )}
      
      {isSubmitting ? (
        <>
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
          {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Saving..."}
        </>
      ) : isSuccess ? (
        <>
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Submitted Successfully!
        </>
      ) : (
        <span className="text-lg font-medium">Submit AI Fail</span>
      )}
    </Button>
  );
};

export default SubmitButton;
