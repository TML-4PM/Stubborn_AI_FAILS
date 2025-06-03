
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteAuditPanel from '@/components/admin/SiteAuditPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
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
            <Globe className="h-8 w-8" />
            Website Audit Tool
          </h1>
          <p className="text-muted-foreground">
            Analyze any website for SEO, accessibility, performance issues, and broken links
          </p>
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
