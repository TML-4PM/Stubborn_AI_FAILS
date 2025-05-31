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
import SystemHealthDashboard from '@/components/admin/SystemHealthDashboard';

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

          <SystemHealthDashboard />

          <div className="mt-8">
            <ContentDiscoveryPanel />
          </div>
        </AdminAuthGuard>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
