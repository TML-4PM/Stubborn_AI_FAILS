
import { useState } from 'react';
import SubmissionGuidelines from '@/components/SubmissionGuidelines';
import { useSubmissionForm } from '@/hooks/useSubmissionForm';
import ErrorDisplay from '@/components/submission/ErrorDisplay';
import BasicInfoFields from '@/components/submission/BasicInfoFields';
import MediaUploadTabs from '@/components/submission/MediaUploadTabs';
import SubmitButton from '@/components/submission/SubmitButton';
import SubmissionHeader from '@/components/submission/SubmissionHeader';

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
        <SubmissionHeader 
          isSubmitting={isSubmitting}
          isSuccess={isSuccess}
        />
        
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
