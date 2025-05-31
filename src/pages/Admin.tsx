
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContentDiscoveryPanel from '@/components/admin/ContentDiscoveryPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Bot } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createSystemUserIfNotExists } from '@/utils/systemUser';

const Admin = () => {
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
        // For now, check if user is the first registered user or has admin email
        // In production, you'd want proper role-based access control
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

  useEffect(() => {
    const initializeSystemUser = async () => {
      if (user && isAdmin) {
        try {
          await createSystemUserIfNotExists(supabase);
          console.log('System user initialization completed');
        } catch (error) {
          console.error('Failed to initialize system user:', error);
        }
      }
    };

    initializeSystemUser();
  }, [user, isAdmin]);

  if (isLoading || checkingPermissions) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Checking permissions...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
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
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage AI fail discovery and content moderation
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Online
                  </div>
                  <div className="text-sm text-muted-foreground">Database</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    Active
                  </div>
                  <div className="text-sm text-muted-foreground">Discovery System</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    Ready
                  </div>
                  <div className="text-sm text-muted-foreground">Content Pipeline</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ContentDiscoveryPanel />
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
