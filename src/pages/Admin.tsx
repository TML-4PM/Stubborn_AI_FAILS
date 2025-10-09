
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import { useUser } from '@/contexts/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Package, 
  BarChart3, 
  Users, 
  FileText,
  Zap,
  AlertCircle,
  Shield,
  Search
} from 'lucide-react';
import PrintifyAdmin from '@/components/admin/PrintifyAdmin';
import QuickSetup from '@/components/admin/QuickSetup';
import ContentModerationPanel from '@/components/admin/ContentModerationPanel';
import ContentAnalytics from '@/components/admin/ContentAnalytics';
import ContentDiscoveryManager from '@/components/admin/ContentDiscoveryManager';

const Admin = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('setup');

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
                  <p className="text-muted-foreground">
                    Please sign in to access the admin dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <AdminAuthGuard>
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
              <Settings className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your AI Oopsies platform
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                Admin Access
              </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="setup" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Setup
                </TabsTrigger>
                <TabsTrigger value="moderation" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Moderation
                </TabsTrigger>
                <TabsTrigger value="discovery" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Discovery
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="shop" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Shop
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="setup" className="mt-6">
                <QuickSetup />
              </TabsContent>

              <TabsContent value="moderation" className="mt-6">
                <ContentModerationPanel />
              </TabsContent>

              <TabsContent value="discovery" className="mt-6">
                <ContentDiscoveryManager />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <ContentAnalytics />
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      User analytics and management features coming soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shop" className="mt-6">
                <PrintifyAdmin />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Platform configuration and settings coming soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </AdminAuthGuard>
      </main>
    </div>
  );
};

export default Admin;
