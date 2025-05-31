
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const { user, isLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingPermissions, setCheckingPermissions] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
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

  if (isLoading || checkingPermissions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
