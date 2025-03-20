
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import BannerAds from './BannerAds';

const SubmissionGuidelines = () => {
  return (
    <>
      <Alert className="mt-8 bg-amber-50 border-amber-200 text-amber-800">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <AlertTitle>Submission Guidelines</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 text-sm space-y-1 list-disc list-inside">
            <li>Images must be appropriate and work-safe.</li>
            <li>No personal information should be visible in screenshots.</li>
            <li>Make sure you have the right to share the content.</li>
            <li>All submissions are moderated before appearing on the site.</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <BannerAds />
    </>
  );
};

export default SubmissionGuidelines;
