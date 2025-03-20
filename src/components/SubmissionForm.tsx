
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import ImageUploader from '@/components/ImageUploader';
import SubmissionGuidelines from '@/components/SubmissionGuidelines';
import { useSubmissionForm } from '@/hooks/useSubmissionForm';

const SubmissionForm = () => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    username,
    setUsername,
    previewUrl,
    isSubmitting,
    isSuccess,
    uploadProgress,
    handleImageChange,
    handleSubmit
  } = useSubmissionForm();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Submit Your AI Fail</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium flex items-center">
              Title <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 'Chatbot Thinks I'm a Goldfish'"
              maxLength={100}
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what happened..."
              rows={3}
              maxLength={500}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username (optional)
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Anonymous"
              maxLength={50}
              className="w-full"
            />
          </div>
          
          <ImageUploader 
            onImageChange={handleImageChange}
            previewUrl={previewUrl}
          />
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full h-11"
              variant={isSuccess ? "default" : "default"}
            >
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
                'Submit AI Fail'
              )}
            </Button>
          </div>
        </form>
      </div>
      
      <SubmissionGuidelines />
    </div>
  );
};

export default SubmissionForm;
