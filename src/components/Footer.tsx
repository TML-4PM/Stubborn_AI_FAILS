
import { Heart, X, Instagram, MessageSquare, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 border-t bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="text-fail h-5 w-5 mr-2" />
            <span className="text-lg font-bold tracking-tight">AI Oopsies</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Gallery
            </Link>
            <Link to="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Submit
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/donate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Donate
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="TikTok"
            >
              {/* Custom TikTok SVG icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                <path d="M15 8c0 4.008-4.554 8-8 8"></path>
                <path d="M15 8h4V4"></path>
                <path d="M19 4v4"></path>
                <path d="M19 8C8.5 7.5 11 0 11 0h4s-.5 8 4 8z"></path>
              </svg>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="X (Twitter)"
            >
              <X className="h-5 w-5" />
            </a>
            <a 
              href="https://whatsapp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="WhatsApp"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a 
              href="https://wechat.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="WeChat"
            >
              <MessageSquare className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>© {currentYear} AI Oopsies. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ by the AI Oopsies team.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
