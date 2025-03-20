
import { useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SubmissionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !imageFile) {
      toast({
        title: "Missing information",
        description: "Please provide a title and an image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('username', username || 'Anonymous');
      formData.append('image', imageFile);

      // Add recipient email to form data
      formData.append('recipient', 'troy.latter@4pm.net.au');
      
      // Convert image to base64 for email attachment
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      reader.onload = async () => {
        formData.append('imageData', reader.result as string);
        
        // Simulate API call (in a real app, this would be an actual API call)
        // In a production app, you might use localStorage as a simple storage solution
        localStorage.setItem(`submission_${Date.now()}`, JSON.stringify({
          title,
          description,
          username: username || 'Anonymous',
          imageUrl: reader.result,
          date: new Date().toISOString()
        }));
        
        // Send email notification (simulated here)
        console.log("Sending submission to: troy.latter@4pm.net.au");
        console.log("Form data:", {
          title,
          description,
          username: username || 'Anonymous',
          imageFilename: imageFile.name
        });
        
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
        }, 2000);
      };
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setIsSubmitting(false);
        toast({
          title: "Error processing image",
          description: "There was a problem with your image. Please try again.",
          variant: "destructive",
        });
      };
      
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your AI fail. Please try again.",
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
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 'Chatbot Thinks I'm a Goldfish'"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              maxLength={100}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what happened..."
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              rows={3}
              maxLength={500}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username (optional)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Anonymous"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              maxLength={50}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Upload Image <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              {previewUrl ? (
                <div className="relative w-full aspect-video mx-auto">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Drag and drop an image, or <span className="text-primary cursor-pointer">browse</span>
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
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all ${
                isSuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Submitting...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Submitted Successfully!
                </>
              ) : (
                'Submit AI Fail'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 p-4 rounded-lg bg-amber-50 border border-amber-200">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-800">Submission Guidelines</h4>
            <ul className="mt-2 text-sm text-amber-700 space-y-1 list-disc list-inside">
              <li>Images must be appropriate and work-safe.</li>
              <li>No personal information should be visible in screenshots.</li>
              <li>Make sure you have the right to share the content.</li>
              <li>All submissions are moderated before appearing on the site.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionForm;
