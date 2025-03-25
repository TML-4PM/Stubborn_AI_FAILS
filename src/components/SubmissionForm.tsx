
import { useState } from 'react';
import { Info } from 'lucide-react';
import SubmissionGuidelines from '@/components/SubmissionGuidelines';
import { useSubmissionForm } from '@/hooks/useSubmissionForm';
import ErrorDisplay from '@/components/submission/ErrorDisplay';
import BasicInfoFields from '@/components/submission/BasicInfoFields';
import MediaUploadTabs from '@/components/submission/MediaUploadTabs';
import SubmitButton from '@/components/submission/SubmitButton';

const SubmissionForm = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'url'>('image');
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    username,
    setUsername,
    previewUrl,
    imageUrl,
    setImageUrl,
    isSubmitting,
    isSuccess,
    uploadProgress,
    errorMessage,
    handleImageChange,
    handleUrlChange,
    handleSubmit,
    resetForm
  } = useSubmissionForm();

  // Function to determine if form is valid for submission
  const isFormValid = () => {
    return (
      title.trim() && 
      ((activeTab === 'image' && previewUrl) || 
       (activeTab === 'url' && imageUrl))
    );
  };

  // Handle "Try Again" after error
  const handleTryAgain = () => {
    if (errorMessage) {
      resetForm();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Submit Your AI Fail</h2>
        
        <ErrorDisplay 
          errorMessage={errorMessage} 
          onTryAgain={handleTryAgain} 
        />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            username={username}
            setUsername={setUsername}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
          />
          
          <MediaUploadTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            previewUrl={previewUrl}
            handleImageChange={handleImageChange}
            handleUrlChange={handleUrlChange}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            errorMessage={errorMessage}
          />
          
          <div className="pt-4">
            <SubmitButton 
              isSubmitting={isSubmitting}
              isSuccess={isSuccess}
              uploadProgress={uploadProgress}
              isFormValid={isFormValid()}
            />
            
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
