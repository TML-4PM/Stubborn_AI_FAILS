
export interface VideoGenerationOptions {
  imageUrl: string;
  title: string;
  description: string;
  duration: number;
  addBranding: boolean;
}

export const generateVideoFromImage = async (options: VideoGenerationOptions): Promise<Blob> => {
  const { imageUrl, title, duration = 5, addBranding = true } = options;
  
  // Create canvas for video generation
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  
  canvas.width = 1920;
  canvas.height = 1080;
  
  // Load image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        // Clear canvas with background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate image dimensions to fit canvas
        const aspectRatio = img.width / img.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.width / aspectRatio;
        
        if (drawHeight > canvas.height) {
          drawHeight = canvas.height;
          drawWidth = canvas.height * aspectRatio;
        }
        
        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;
        
        // Draw image
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        // Add title overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, canvas.width / 2, canvas.height - 80);
        
        // Add branding if requested
        if (addBranding) {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
          ctx.fillRect(50, 50, 200, 80);
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('AI FAILS', 70, 100);
        }
        
        // Convert canvas to blob (simplified - in real app would use MediaRecorder)
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate video blob'));
          }
        }, 'image/png');
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};

export const generateHashtags = (title: string, category: string): string[] => {
  const baseHashtags = ['#AIFails', '#AI', '#TechFails', '#Funny', '#Viral'];
  const categoryHashtags = {
    'ChatGPT': ['#ChatGPT', '#OpenAI', '#LLM'],
    'Image Generation': ['#MidjourneyFails', '#StableDiffusion', '#AIArt'],
    'Voice Assistant': ['#Siri', '#Alexa', '#VoiceAI'],
    'Code Generation': ['#CodeFails', '#Programming', '#GitHub']
  };
  
  const titleWords = title.toLowerCase().split(' ');
  const relevantHashtags = titleWords
    .filter(word => word.length > 4)
    .map(word => `#${word.charAt(0).toUpperCase() + word.slice(1)}`)
    .slice(0, 3);
  
  return [
    ...baseHashtags,
    ...(categoryHashtags[category as keyof typeof categoryHashtags] || []),
    ...relevantHashtags
  ].slice(0, 10);
};
