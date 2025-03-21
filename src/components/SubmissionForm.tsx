
import { Loader2, CheckCircle2, Info } from 'lucide-react';
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
      <div className="glass rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Submit Your AI Fail</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium flex items-center justify-between">
              <span className="flex items-center">
                Title <span className="text-red-500 ml-1">*</span>
              </span>
              <span className="text-xs text-muted-foreground">{title.length}/100</span>
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
            <label htmlFor="description" className="text-sm font-medium flex items-center justify-between">
              <span>Description (optional)</span>
              <span className="text-xs text-muted-foreground">{description.length}/500</span>
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
            <label htmlFor="username" className="text-sm font-medium flex items-center justify-between">
              <span>Username (optional)</span>
              <span className="text-xs text-muted-foreground">{username.length}/50</span>
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
              disabled={isSubmitting || isSuccess || !title.trim()}
              className="w-full h-12 relative overflow-hidden bg-blue-500 hover:bg-blue-600 text-white"
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
            
            {!isSubmitting && !isSuccess && (
              <p className="text-xs text-center mt-2 text-muted-foreground flex items-center justify-center">
                <Info className="w-3 h-3 mr-1" />
                Your submission will be reviewed before appearing in the gallery
              </p>
            )}
          </div>
        </form>
      </div>
      
      <div className="mt-8">
        <SubmissionGuidelines />
      </div>
    </div>
  );
};

export default SubmissionForm;
