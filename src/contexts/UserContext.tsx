
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { getCurrentSession, setupAuthListener } from '@/utils/authUtils';

export interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  metadata?: {
    bio?: string;
    [key: string]: any;
  };
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const auth = useAuth();
  const profile = useProfile();

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      const session = await getCurrentSession();
      
      if (session) {
        const profileData = await profile.fetchProfile(session.user.id);
        
        setUser({
          id: session.user.id,
          email: session.user.email!,
          username: profileData?.username || null,
          avatar_url: profileData?.avatar_url || null
        });
      }
      
      setIsLoading(false);
    };
    
    checkSession();
    
    const { data: authListener } = setupAuthListener(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const profileData = await profile.fetchProfile(session.user.id);
        
        setUser({
          id: session.user.id,
          email: session.user.email!,
          username: profileData?.username || null,
          avatar_url: profileData?.avatar_url || null
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUpdateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = await profile.updateProfile(user, data);
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    isLoading: isLoading || auth.isLoading || profile.isLoading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    signOut: auth.signOut,
    updateProfile: handleUpdateProfile
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};
