
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

// DEV MODE: Set to true to bypass admin checks during development
const DEV_MODE = import.meta.env.DEV;

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const { user, isLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingPermissions, setCheckingPermissions] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('Checking admin status for user:', user?.id, 'DEV_MODE:', DEV_MODE);
      
      // DEV MODE: Skip admin check and grant access immediately
      if (DEV_MODE) {
        console.log('DEV MODE: Bypassing admin check - granting admin access');
        setIsAdmin(true);
        setCheckingPermissions(false);
        return;
      }
      
      if (!user) {
        console.log('No user found');
        setCheckingPermissions(false);
        return;
      }

      try {
        // SECURITY: Check user_roles table for admin role
        // This is a client-side check for UI only - actual security is enforced server-side via RLS
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          setCheckingPermissions(false);
          return;
        }

        console.log('Admin check results:', {
          hasAdminRole: !!roles,
          userEmail: user.email,
          userId: user.id
        });
        
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

  console.log('AdminAuthGuard state:', { isLoading, checkingPermissions, isAdmin, user: !!user });

  if (isLoading || checkingPermissions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user && !DEV_MODE) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin && !DEV_MODE) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              You don't have permission to access the admin panel.
            </p>
            {user?.email && (
              <p className="text-sm text-muted-foreground mt-2">
                Current user: {user.email}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
