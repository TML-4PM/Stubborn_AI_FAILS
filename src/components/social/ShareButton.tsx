
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
import { Share, Copy, Instagram, Phone, Link as LinkIcon, Mail, X, TikTok, MessageSquare } from 'lucide-react';
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
          <TikTok className="mr-2 h-4 w-4" />
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
        <DropdownMenuItem onClick={() => handleShareToSocial('linkedin')} className="flex cursor-pointer items-center">
          <Mail className="mr-2 h-4 w-4" />
          <span>Share via Email</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
