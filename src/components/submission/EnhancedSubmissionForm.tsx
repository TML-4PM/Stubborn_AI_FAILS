
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Link as LinkIcon, 
  CheckCircle, 
  AlertCircle, 
  Tag, 
  FileText,
  User
} from 'lucide-react';
import { useEnhancedSubmissionForm } from '@/hooks/useEnhancedSubmissionForm';
import ImageUploader from '@/components/ImageUploader';

const EnhancedSubmissionForm = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'url'>('image');
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    username,
    setUsername,
    tags,
    setTags,
    submissionNotes,
    setSubmissionNotes,
    imageFile,
    imageUrl,
    setImageUrl,
    isUrl,
    previewUrl,
    isSubmitting,
    isSuccess,
    uploadProgress,
    errorMessage,
    handleImageChange,
    handleUrlChange,
    handleMetadataFetched,
    handleSubmit,
    resetForm,
    isUserLoggedIn,
    contentType,
    metadata
  } = useEnhancedSubmissionForm();

  const isFormValid = (): boolean => {
    return !!(
      title.trim() && 
      description.trim() &&
      ((activeTab === 'image' && previewUrl) || 
       (activeTab === 'url' && imageUrl))
    );
  };

  const handleTryAgain = () => {
    if (errorMessage) {
      resetForm();
    }
  };

  const getTagBadges = () => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {isSuccess ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : isSubmitting ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : (
              <Upload className="h-6 w-6" />
            )}
            {isSuccess ? 'Submission Successful!' : 'Submit AI Fail'}
          </CardTitle>
          {isSuccess && (
            <p className="text-sm text-muted-foreground">
              Your submission is being reviewed and will be published once approved.
            </p>
          )}
        </CardHeader>
        
        <CardContent>
          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p className="font-medium">Submission Error</p>
              </div>
              <p className="text-sm mt-1">{errorMessage}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTryAgain}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Give your AI fail a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting || isSuccess}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {title.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what went wrong with the AI..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting || isSuccess}
                  maxLength={500}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {description.length}/500 characters
                </p>
              </div>

              {!isUserLoggedIn && (
                <div>
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Username (optional)
                  </Label>
                  <Input
                    id="username"
                    placeholder="Your display name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSubmitting || isSuccess}
                    maxLength={50}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="tags" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags (optional)
                </Label>
                <Input
                  id="tags"
                  placeholder="AI, chatbot, image generation, etc. (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isSubmitting || isSuccess}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {getTagBadges().map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Additional Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional context or information..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  disabled={isSubmitting || isSuccess}
                  maxLength={300}
                  rows={3}
                />
              </div>
            </div>
            
            {/* Media Upload */}
            <div>
              <Label className="text-base font-medium">Upload Evidence</Label>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'image' | 'url')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Image URL
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="image" className="mt-4">
                  <ImageUploader
                    onImageChange={handleImageChange}
                    previewUrl={previewUrl}
                    isSubmitting={isSubmitting}
                    errorMessage={errorMessage}
                  />
                </TabsContent>
                
                <TabsContent value="url" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL <span className="text-red-500">*</span></Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      disabled={isSubmitting || isSuccess}
                    />
                    {previewUrl && activeTab === 'url' && (
                      <div className="mt-4">
                        <img 
                          src={previewUrl} 
                          alt="Preview"
                          className="max-w-full h-48 object-cover rounded-lg"
                          onError={() => handleUrlChange('')}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isSuccess || !isFormValid()}
                size="lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Submitted Successfully!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Submit AI Fail</span>
                  </div>
                )}
              </Button>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-3">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSubmissionForm;
