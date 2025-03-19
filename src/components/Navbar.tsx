
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Home, Image, Send, Info } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4 mr-2" /> },
    { path: '/gallery', label: 'Gallery', icon: <Image className="w-4 h-4 mr-2" /> },
    { path: '/submit', label: 'Submit', icon: <Send className="w-4 h-4 mr-2" /> },
    { path: '/about', label: 'About', icon: <Info className="w-4 h-4 mr-2" /> }
  ];

  const handleNavigate = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-2' : 'bg-transparent py-4'}`}>
      <div className="container px-4 mx-auto flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => handleNavigate('/')}
        >
          <Heart className="text-fail h-6 w-6 mr-2 animate-pulse-subtle" />
          <span className="text-xl font-bold tracking-tight">AI Oopsies</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`px-4 py-2 rounded-full text-sm flex items-center transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass absolute w-full py-4 animate-slide-down">
          <div className="container px-4 mx-auto flex flex-col space-y-2">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`px-4 py-3 rounded-lg text-sm flex items-center transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
