
import { Info } from 'lucide-react';

const SubmissionHeader = () => {
  return (
    <div className="max-w-3xl mx-auto text-center mb-6">
      <h2 className="text-2xl font-bold mb-2">Submit Your AI Fail</h2>
      {!isSubmitting && !isSuccess && (
        <p className="text-xs text-center mt-2 text-muted-foreground flex items-center justify-center">
          <Info className="w-3 h-3 mr-1" />
          Your submission will be reviewed before appearing in the gallery
        </p>
      )}
    </div>
  );
};

export default SubmissionHeader;
