import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bot, Home, Image, Upload, Youtube, Info, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from './ThemeToggle';
import UserNavigation from './UserNavigation';
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Gallery', href: '/gallery', icon: Image },
    { name: 'Submit', href: '/submit', icon: Upload },
    { name: 'YouTube', href: '/youtube', icon: Youtube },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Donate', href: '/donate', icon: Heart },
  ];

  // Add admin link for authenticated users
  const adminNavigation = user ? [...navigation, { name: 'Admin', href: '/admin', icon: Bot }] : navigation;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-lg border-b shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-fail hover:text-fail-dark transition-colors"
          >
            <Bot className="h-8 w-8" />
            <span>AI Fails</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-fail text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <UserNavigation />
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-6 w-6 text-fail" />
                      <span className="font-bold text-lg">AI Fails</span>
                    </div>
                  </div>
                  
                  <nav className="flex-1 space-y-2">
                    {adminNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-fail text-white'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </nav>
                  
                  <div className="border-t pt-4 mt-4">
                    <UserNavigation />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
