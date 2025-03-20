
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'signIn' | 'signUp';
}

const AuthModal = ({ isOpen, onClose, defaultView = 'signIn' }: AuthModalProps) => {
  const [view, setView] = useState<'signIn' | 'signUp'>(defaultView);
  
  const handleSuccess = () => {
    // Close the modal and reset view to default
    onClose();
    setTimeout(() => {
      setView(defaultView);
    }, 300);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {view === 'signIn' ? 'Sign In' : 'Create Account'}
            </DialogTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogDescription>
            {view === 'signIn' 
              ? 'Enter your details to sign in to your account.' 
              : 'Enter your details to create a new account.'}
          </DialogDescription>
        </DialogHeader>
        
        {view === 'signIn' ? (
          <SignIn switchToSignUp={() => setView('signUp')} onSuccess={handleSuccess} />
        ) : (
          <SignUp switchToSignIn={() => setView('signIn')} onSuccess={handleSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
