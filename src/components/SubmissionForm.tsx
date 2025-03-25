
import { useState } from 'react';
import { Loader2, CheckCircle2, Info, Link as LinkIcon, Image, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ImageUploader from '@/components/ImageUploader';
import SubmissionGuidelines from '@/components/SubmissionGuidelines';
import { useSubmissionForm } from '@/hooks/useSubmissionForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTransitionNavigation } from '@/hooks/useTransitionNavigation';

const SubmissionForm = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'url'>('image');
  const { showNotification } = useTransitionNavigation();
  
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
        
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {errorMessage}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={handleTryAgain}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
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
              disabled={isSubmitting || isSuccess}
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
              disabled={isSubmitting || isSuccess}
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
              disabled={isSubmitting || isSuccess}
            />
          </div>
          
          <Tabs 
            defaultValue="image" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'image' | 'url')}
            disabled={isSubmitting || isSuccess}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image" className="flex items-center justify-center" disabled={isSubmitting || isSuccess}>
                <Image className="w-4 h-4 mr-2" />
                <span>Upload Image</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center justify-center" disabled={isSubmitting || isSuccess}>
                <LinkIcon className="w-4 h-4 mr-2" />
                <span>Submit URL</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="image" className="pt-4">
              <ImageUploader 
                onImageChange={handleImageChange}
                previewUrl={activeTab === 'image' ? previewUrl : null}
                isSubmitting={isSubmitting}
                errorMessage={activeTab === 'image' ? errorMessage : null}
              />
            </TabsContent>
            <TabsContent value="url" className="pt-4">
              <div className="space-y-2">
                <label htmlFor="image-url" className="text-sm font-medium flex items-center">
                  Enter URL <span className="text-red-500 ml-1">*</span>
                  <div className="ml-2 cursor-help group relative">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-popover rounded-md shadow-md text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      Paste a direct link to an image, screenshot, or webpage
                    </div>
                  </div>
                </label>
                <Input
                  id="image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    handleUrlChange(e.target.value);
                  }}
                  placeholder="https://example.com/your-ai-fail.jpg"
                  className="w-full"
                  disabled={isSubmitting || isSuccess}
                />
                {errorMessage && activeTab === 'url' && (
                  <div className="text-sm text-destructive flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {previewUrl && activeTab === 'url' && (
                  <div className="mt-4 border border-border rounded-lg overflow-hidden">
                    <div className="aspect-video w-full relative">
                      <img 
                        src={previewUrl} 
                        alt="URL Preview" 
                        className="w-full h-full object-contain"
                        onError={() => {
                          showNotification("Failed to load image from URL. Please check the URL and try again.", "error");
                        }}
                        id="url-preview"
                      />
                      {!isSubmitting && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setImageUrl('');
                            handleUrlChange('');
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isSuccess || !isFormValid()}
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
