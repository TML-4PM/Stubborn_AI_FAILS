
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContentDiscoveryPanel from '@/components/admin/ContentDiscoveryPanel';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import SiteAuditPanel from '@/components/admin/SiteAuditPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Bot, Globe, Activity } from 'lucide-react';
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
              Manage AI fail discovery, content moderation, and site health monitoring
            </p>
          </div>

          <Tabs defaultValue="health" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="health" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                System Health
              </TabsTrigger>
              <TabsTrigger value="discovery" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Content Discovery
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Site Audit
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database
              </TabsTrigger>
            </TabsList>

            <TabsContent value="health" className="mt-6">
              <SystemHealthDashboard />
            </TabsContent>

            <TabsContent value="discovery" className="mt-6">
              <ContentDiscoveryPanel />
            </TabsContent>

            <TabsContent value="audit" className="mt-6">
              <SiteAuditPanel />
            </TabsContent>

            <TabsContent value="database" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Database management tools and utilities will be available here.
                    For now, use the Supabase dashboard for direct database access.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </AdminAuthGuard>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
