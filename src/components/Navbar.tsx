
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap, Settings, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import UserNavigation from './UserNavigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Gallery', href: '/gallery', icon: null },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Shop', href: '/shop', icon: null },
    { name: 'Submit', href: '/submit', icon: null },
    { name: 'Donate', href: '/donate', icon: null },
  ];

  // Add admin link for authenticated users
  if (user) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Settings });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-fail" />
              <span className="font-bold text-xl">AI Oopsies</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
            <UserNavigation />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <UserNavigation />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
