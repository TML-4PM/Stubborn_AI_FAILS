
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Share, Copy, Facebook, Twitter, Linkedin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareButtonProps {
  failId: string;
  title: string;
}

const ShareButton = ({ failId, title }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getShareUrl = () => {
    return `${window.location.origin}/fail/${failId}`;
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
  
  const handleShareToSocial = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const url = getShareUrl();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(`Check out this AI fail: ${title}`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('facebook')}>
          <Facebook className="mr-2 h-4 w-4" />
          <span>Share to Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('twitter')}>
          <Twitter className="mr-2 h-4 w-4" />
          <span>Share to Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('linkedin')}>
          <Linkedin className="mr-2 h-4 w-4" />
          <span>Share to LinkedIn</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
