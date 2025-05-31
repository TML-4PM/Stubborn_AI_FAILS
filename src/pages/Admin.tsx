
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContentDiscoveryPanel from '@/components/admin/ContentDiscoveryPanel';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Bot } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createSystemUserIfNotExists } from '@/utils/systemUser';

const Admin = () => {
  const { user } = useUser();

  useEffect(() => {
    const initializeSystemUser = async () => {
      if (user) {
        try {
          await createSystemUserIfNotExists(supabase);
          console.log('System user initialization completed');
        } catch (error) {
          console.error('Failed to initialize system user:', error);
        }
      }
    };

    initializeSystemUser();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AdminAuthGuard>
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
        </AdminAuthGuard>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
