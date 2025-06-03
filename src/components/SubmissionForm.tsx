
import EnhancedSubmissionForm from '@/components/submission/EnhancedSubmissionForm';
import SubmissionGuidelines from '@/components/SubmissionGuidelines';

const SubmissionForm = () => {
  return (
    <div className="space-y-8">
      <EnhancedSubmissionForm />
      <SubmissionGuidelines />
    </div>
  );
};

export default SubmissionForm;
