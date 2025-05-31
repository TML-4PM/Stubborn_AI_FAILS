
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

export const useAdminCheck = () => {
  const { user, isLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingPermissions, setCheckingPermissions] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingPermissions(false);
        return;
      }

      try {
        // Check if user is the first registered user or has admin email
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('user_id, created_at')
          .order('created_at', { ascending: true })
          .limit(1);

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setCheckingPermissions(false);
          return;
        }

        // Check if current user is the first user or has admin email
        const isFirstUser = profiles?.[0]?.user_id === user.id;
        const hasAdminEmail = user.email?.includes('admin') || user.email?.includes('test');
        
        setIsAdmin(isFirstUser || hasAdminEmail || false);
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setCheckingPermissions(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, checkingPermissions, isLoading };
};
