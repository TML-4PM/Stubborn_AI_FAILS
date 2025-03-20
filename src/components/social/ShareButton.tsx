
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Share, Copy, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';
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
  
  const handleShareToSocial = (platform: 'facebook' | 'twitter' | 'linkedin' | 'email') => {
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
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
    }
    
    if (platform !== 'email') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } else {
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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share this fail</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} className="flex cursor-pointer items-center">
          <LinkIcon className="mr-2 h-4 w-4" />
          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('facebook')} className="flex cursor-pointer items-center">
          <Facebook className="mr-2 h-4 w-4" />
          <span>Share to Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('twitter')} className="flex cursor-pointer items-center">
          <Twitter className="mr-2 h-4 w-4" />
          <span>Share to Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('linkedin')} className="flex cursor-pointer items-center">
          <Linkedin className="mr-2 h-4 w-4" />
          <span>Share to LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('email')} className="flex cursor-pointer items-center">
          <Mail className="mr-2 h-4 w-4" />
          <span>Share via Email</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
