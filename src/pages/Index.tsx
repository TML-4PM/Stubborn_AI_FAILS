
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedFails from '@/components/FeaturedFails';
import TrendingSection from '@/components/TrendingSection';
import QuickActions from '@/components/QuickActions';
import { supabase } from '@/integrations/supabase/client';
import { useDataInitialization } from '@/hooks/useDataInitialization';

const Index = () => {
  // Initialize data on app load
  const { isInitialized } = useDataInitialization();

  // Fetch featured AI fails from the database
  const { data: featuredFails, isLoading } = useQuery({
    queryKey: ['featured-fails'],
    queryFn: async () => {
      console.log('Fetching featured AI fails...');
      const { data, error } = await supabase
        .from('oopsies')
        .select('*')
        .eq('status', 'approved')
        .order('viral_score', { ascending: false })
        .limit(6);
      
      if (error) {
        console.error('Error fetching featured fails:', error);
        throw error;
      }
      
      return data;
    },
    enabled: isInitialized, // Only fetch when data is initialized
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch trending fails
  const { data: trendingFails } = useQuery({
    queryKey: ['trending-fails'],
    queryFn: async () => {
      console.log('Fetching trending AI fails...');
      const { data, error } = await supabase
        .from('oopsies')
        .select('*')
        .eq('status', 'approved')
        .gte('viral_score', 50)
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) {
        console.error('Error fetching trending fails:', error);
        throw error;
      }
      
      return data;
    },
    enabled: isInitialized,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-12 space-y-16">
          <QuickActions />
          <FeaturedFails fails={featuredFails} isLoading={isLoading} />
          <TrendingSection fails={trendingFails} isLoading={isLoading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
