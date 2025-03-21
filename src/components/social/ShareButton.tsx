
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
import { Share, Copy, Instagram, Phone, Link as LinkIcon, Mail, X, MessageSquare } from 'lucide-react';
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
  
  const handleShareToSocial = (platform: 'instagram' | 'x' | 'linkedin' | 'email' | 'whatsapp' | 'tiktok' | 'wechat') => {
    const url = getShareUrl();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(`Check out this AI fail: ${title}`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'instagram':
        // Instagram doesn't have a direct share URL like other platforms
        // Usually opens the app, but copy the link is the best alternative
        navigator.clipboard.writeText(`${encodedTitle} ${url}`);
        toast({
          title: "Ready to share on Instagram",
          description: "Caption and link copied. Paste in Instagram to share.",
        });
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'tiktok':
        // TikTok doesn't have a direct share URL
        // Copy to clipboard is the best alternative
        navigator.clipboard.writeText(`${encodedTitle} ${url}`);
        toast({
          title: "Ready to share on TikTok",
          description: "Caption and link copied. Paste in TikTok to share.",
        });
        break;
      case 'wechat':
        // WeChat doesn't have a direct share URL
        // Copy to clipboard is the best alternative
        navigator.clipboard.writeText(`${encodedTitle} ${url}`);
        toast({
          title: "Ready to share on WeChat",
          description: "Caption and link copied. Paste in WeChat to share.",
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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share this fail</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink} className="flex cursor-pointer items-center">
          <LinkIcon className="mr-2 h-4 w-4" />
          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('instagram')} className="flex cursor-pointer items-center">
          <Instagram className="mr-2 h-4 w-4" />
          <span>Share to Instagram</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('x')} className="flex cursor-pointer items-center">
          <X className="mr-2 h-4 w-4" />
          <span>Share to X</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('tiktok')} className="flex cursor-pointer items-center">
          {/* Custom TikTok SVG icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
            <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
            <path d="M15 8c0 4.008-4.554 8-8 8"></path>
            <path d="M15 8h4V4"></path>
            <path d="M19 4v4"></path>
            <path d="M19 8C8.5 7.5 11 0 11 0h4s-.5 8 4 8z"></path>
          </svg>
          <span>Share to TikTok</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('wechat')} className="flex cursor-pointer items-center">
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Share to WeChat</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShareToSocial('whatsapp')} className="flex cursor-pointer items-center">
          <Phone className="mr-2 h-4 w-4" />
          <span>Share to WhatsApp</span>
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
