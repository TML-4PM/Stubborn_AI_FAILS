
import { useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const SubmissionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadProgress(0);
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your submission",
        variant: "destructive",
      });
      return false;
    }

    if (!imageFile) {
      toast({
        title: "Image required",
        description: "Please upload an image of your AI fail",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      // Generate a unique file name for the image
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `fails/${fileName}`;

      setUploadProgress(30);
      
      // Upload image to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('ai-fails')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Error uploading image: ${uploadError.message}`);
      }

      setUploadProgress(60);

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('ai-fails')
        .getPublicUrl(filePath);

      setUploadProgress(80);

      // Save submission data to Supabase database
      const { error: insertError } = await supabase
        .from('submissions')
        .insert({
          title,
          description,
          username: username || 'Anonymous',
          image_url: publicUrl,
          created_at: new Date().toISOString(),
          status: 'pending' // For moderation purposes
        });

      if (insertError) {
        throw new Error(`Error saving submission: ${insertError.message}`);
      }

      setUploadProgress(100);
      
      // Submission was successful
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Submission received!",
        description: "Your AI fail has been submitted for review.",
      });

      // Reset form after submission
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setUsername('');
        setImageFile(null);
        setPreviewUrl(null);
        setIsSuccess(false);
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setUploadProgress(0);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "There was a problem submitting your AI fail. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium flex items-center">
              Upload Image <span className="text-red-500 ml-1">*</span>
              <div className="ml-2 cursor-help group relative">
                <Info className="h-4 w-4 text-muted-foreground" />
                <div className="absolute left-full ml-2 top-0 w-48 p-2 bg-popover rounded-md shadow-md text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  PNG, JPG or GIF, max 5MB
                </div>
              </div>
            </label>
            <label 
              htmlFor="image" 
              className={`border-2 border-dashed rounded-lg p-8 text-center block cursor-pointer transition-colors ${
                previewUrl ? 'border-primary/50 bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
              }`}
            >
              {previewUrl ? (
                <div className="relative w-full aspect-video mx-auto">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreviewUrl(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                    aria-label="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Drag and drop an image, or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or GIF, max 5MB
                    </p>
                  </div>
                </div>
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
                required={!imageFile}
              />
            </label>
          </div>
          
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
    </div>
  );
};

export default SubmissionForm;
