
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteAuditPanel from '@/components/admin/SiteAuditPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Shield, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Target className="h-8 w-8" />
            AI Fails Site Health Monitor
          </h1>
          <p className="text-muted-foreground">
            Comprehensive monitoring and analysis of this website's SEO, accessibility, performance, and core functionality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SEO Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Optimized</div>
              <p className="text-xs text-muted-foreground">Titles, meta, structure</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accessibility</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Inclusive</div>
              <p className="text-xs text-muted-foreground">ARIA, alt text, navigation</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">Fast</div>
              <p className="text-xs text-muted-foreground">Load times, optimization</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Functionality</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Working</div>
              <p className="text-xs text-muted-foreground">Forms, links, features</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <SiteAuditPanel />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
