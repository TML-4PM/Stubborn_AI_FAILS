
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import BannerAds from './BannerAds';

const SubmissionGuidelines = () => {
  return (
    <div className="space-y-6">
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <AlertTitle className="text-base md:text-lg">Submission Guidelines</AlertTitle>
        <AlertDescription>
          <ul className="mt-2 text-sm space-y-1.5 list-disc list-inside">
            <li>Images must be appropriate and work-safe.</li>
            <li>No personal information should be visible in screenshots.</li>
            <li>Make sure you have the right to share the content.</li>
            <li>All submissions are moderated before appearing on the site.</li>
            <li>By submitting, you agree to our <a href="/terms" className="underline hover:text-amber-900 font-medium">Terms of Service</a>.</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <BannerAds maxAds={2} className="pt-2" />
    </div>
  );
};

export default SubmissionGuidelines;
