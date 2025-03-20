
import { Heart, Github } from 'lucide-react';
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
          
          <a 
            href="https://github.com/ai-oopsies/website" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="h-5 w-5" />
          </a>
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
