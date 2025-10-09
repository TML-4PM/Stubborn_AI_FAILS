
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import AuthModal from './auth/AuthModal';
import RealtimeNotificationPanel from './notifications/RealtimeNotificationPanel';

const UserNavigation = () => {
  const { user, signOut } = useUser();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn');
  
  const openSignIn = () => {
    setAuthView('signIn');
    setIsAuthModalOpen(true);
  };
  
  const openSignUp = () => {
    setAuthView('signUp');
    setIsAuthModalOpen(true);
  };
  
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <RealtimeNotificationPanel />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url || undefined} alt={user.username || 'User'} />
                <AvatarFallback>
                  {user.username ? user.username[0].toUpperCase() : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user.username || user.full_name || 'User'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile?tab=settings" className="cursor-pointer flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => signOut()}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  
  // Don't show sign in/up buttons for unauthenticated users (moved to Footer)
  return null;
};

export default UserNavigation;
