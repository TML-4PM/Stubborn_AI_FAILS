
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup
} from '@/components/ui/dropdown-menu';
import { 
  Share, Copy, Instagram, Phone, Link as LinkIcon, Mail, X, MessageSquare, 
  Youtube, Video, Sparkles, Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateHashtags } from '@/utils/videoUtils';
import { useYouTube } from '@/hooks/useYouTube';

interface EnhancedShareButtonProps {
  failId: string;
  title: string;
  imageUrl: string;
  category: string;
  description?: string;
}

const EnhancedShareButton = ({ failId, title, imageUrl, category, description }: EnhancedShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { uploadToYouTube, isUploading } = useYouTube();
  
  const getShareUrl = () => {
    return `${window.location.origin}/fail/${failId}`;
  };
  
  const generateSmartCaption = (platform: string) => {
    const hashtags = generateHashtags(title, category);
    const url = getShareUrl();
    
    const platformCaptions = {
      instagram: `${title}\n\n${description || 'Another hilarious AI fail! 🤖💥'}\n\n${hashtags.slice(0, 5).join(' ')}\n\nLink in bio!`,
      twitter: `${title}\n\n${hashtags.slice(0, 3).join(' ')}\n\n${url}`,
      tiktok: `${title}\n\nWhen AI goes wrong 😅\n\n${hashtags.slice(0, 3).join(' ')}\n\n${url}`,
      youtube: `${title}\n\n${description || 'Check out this hilarious AI fail!'}\n\nTags: ${hashtags.join(', ')}`
    };
    
    return platformCaptions[platform as keyof typeof platformCaptions] || `${title} - ${url}`;
  };
  
  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI Fail: ${title}`,
          text: generateSmartCaption('twitter'),
          url: getShareUrl()
        });
        toast({
          title: "Shared successfully!",
          description: "Content shared using device's native sharing.",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Web Share failed:', error);
        }
      }
    }
    setIsOpen(false);
  };
  
  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Couldn't copy link",
        description: "Please try again or copy the URL manually",
        variant: "destructive",
      });
    }
    setIsOpen(false);
  };
  
  const handleCreateVideo = async () => {
    try {
      const { generateVideoFromImage } = await import('@/utils/videoUtils');
      
      toast({
        title: "Creating video...",
        description: "Generating video content from your AI fail.",
      });
      
      const videoBlob = await generateVideoFromImage({
        imageUrl,
        title,
        description: description || '',
        duration: 5,
        addBranding: true
      });
      
      const uploadData = {
        title: `AI Fail: ${title}`,
        description: generateSmartCaption('youtube'),
        tags: generateHashtags(title, category),
        videoBlob
      };
      
      const result = await uploadToYouTube(uploadData);
      
      if (result.success) {
        toast({
          title: "Video created and uploaded!",
          description: "Your AI fail video is now live on YouTube.",
        });
      }
    } catch (error) {
      console.error('Video creation failed:', error);
      toast({
        title: "Video creation failed",
        description: "Unable to create video. Please try again.",
        variant: "destructive"
      });
    }
    setIsOpen(false);
  };
  
  const handleShareToSocial = (platform: string) => {
    const url = getShareUrl();
    const encodedUrl = encodeURIComponent(url);
    const caption = generateSmartCaption(platform);
    const encodedCaption = encodeURIComponent(caption);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'instagram':
        navigator.clipboard.writeText(caption);
        toast({
          title: "Ready to share on Instagram",
          description: "Smart caption copied. Paste in Instagram to share.",
        });
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedCaption}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`AI Fail: ${title}`)}&body=${encodedCaption}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedCaption}`;
        break;
      case 'tiktok':
        navigator.clipboard.writeText(caption);
        toast({
          title: "Ready to share on TikTok",
          description: "Smart caption copied. Paste in TikTok to share.",
        });
        break;
    }
    
    if (shareUrl && platform !== 'email') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } else if (shareUrl) {
      window.location.href = shareUrl;
    }
    
    setIsOpen(false);
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Share this AI fail">
          <Share className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center">
          <Sparkles className="mr-2 h-4 w-4" />
          Smart Share Options
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          {navigator.share && (
            <DropdownMenuItem onClick={handleWebShare} className="flex cursor-pointer items-center">
              <Zap className="mr-2 h-4 w-4" />
              <span>Quick Share</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleCopyLink} className="flex cursor-pointer items-center">
            <LinkIcon className="mr-2 h-4 w-4" />
            <span>Copy Link</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleCreateVideo} 
            disabled={isUploading}
            className="flex cursor-pointer items-center"
          >
            <Youtube className="mr-2 h-4 w-4" />
            <span>{isUploading ? 'Creating Video...' : 'Create & Upload to YouTube'}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Social Platforms</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => handleShareToSocial('instagram')} className="flex cursor-pointer items-center">
          <Instagram className="mr-2 h-4 w-4" />
          <span>Instagram Stories</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('x')} className="flex cursor-pointer items-center">
          <X className="mr-2 h-4 w-4" />
          <span>X (Twitter)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('tiktok')} className="flex cursor-pointer items-center">
          <Video className="mr-2 h-4 w-4" />
          <span>TikTok</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('whatsapp')} className="flex cursor-pointer items-center">
          <Phone className="mr-2 h-4 w-4" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('email')} className="flex cursor-pointer items-center">
          <Mail className="mr-2 h-4 w-4" />
          <span>Email</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedShareButton;
