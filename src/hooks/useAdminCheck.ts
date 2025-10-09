import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

// DEV MODE: Set to true to bypass admin checks during development
const DEV_MODE = import.meta.env.DEV;

/**
 * SECURITY: Admin status is enforced server-side via RLS policies using the user_roles table.
 * This client-side check is ONLY for UI/UX purposes. All sensitive operations are protected 
 * by database-level RLS policies that cannot be bypassed from the client.
 */
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

      // DEV MODE: Skip admin check and grant access
      if (DEV_MODE) {
        console.log('DEV MODE: Bypassing admin check - granting admin access');
        setIsAdmin(true);
        setCheckingPermissions(false);
        return;
      }

      try {
        // Check user_roles table for admin role
        // This is a client-side check for UI only - actual security is enforced server-side via RLS
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setCheckingPermissions(false);
          return;
        }

        setIsAdmin(!!roles);
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
