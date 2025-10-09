
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';

import Hero from '@/components/Hero';
import FeaturedFails from '@/components/FeaturedFails';
import TrendingSection from '@/components/TrendingSection';
import QuickActions from '@/components/QuickActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDataInitialization } from '@/hooks/useDataInitialization';
import { getFeaturedFails, getAllFails } from '@/data/sampleFails';

const Index = () => {
  const [useFallbackData, setUseFallbackData] = useState(false);
  const [showInitializationError, setShowInitializationError] = useState(false);
  
  // Initialize data on app load
  const { isInitialized, error: initError, initializeData } = useDataInitialization();

  // Always show fallback data initially to ensure the page loads
  useEffect(() => {
    console.log('🏠 Index component mounted, isInitialized:', isInitialized);
    if (!isInitialized) {
      console.log('📋 Using fallback data while initializing...');
      setUseFallbackData(true);
    }

    // Show initialization error after a delay if there's an error
    if (initError) {
      const timer = setTimeout(() => {
        setShowInitializationError(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, initError]);

  // Fetch featured AI fails from the database with fallback
  const { data: featuredFails, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featured-fails'],
    queryFn: async () => {
      console.log('🔍 Fetching featured AI fails...');
      const { data, error } = await supabase
        .from('oopsies')
        .select('*')
        .eq('status', 'approved')
        .order('viral_score', { ascending: false })
        .limit(6);
      
      if (error) {
        console.error('❌ Error fetching featured fails:', error);
        throw error;
      }
      
      console.log('✅ Featured fails fetched:', data?.length || 0);
      return data;
    },
    enabled: isInitialized && !useFallbackData,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // Fetch trending fails with fallback
  const { data: trendingFails, isLoading: trendingLoading, error: trendingError } = useQuery({
    queryKey: ['trending-fails'],
    queryFn: async () => {
      console.log('🔥 Fetching trending AI fails...');
      const { data, error } = await supabase
        .from('oopsies')
        .select('*')
        .eq('status', 'approved')
        .gte('viral_score', 50)
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) {
        console.error('❌ Error fetching trending fails:', error);
        throw error;
      }
      
      console.log('✅ Trending fails fetched:', data?.length || 0);
      return data;
    },
    enabled: isInitialized && !useFallbackData,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  // Use fallback data if database queries fail or return empty, or if not initialized
  useEffect(() => {
    if (featuredError || trendingError || (!useFallbackData && isInitialized && !featuredFails?.length && !trendingFails?.length)) {
      console.log('🔄 Using fallback static data due to database issues or empty results');
      setUseFallbackData(true);
    } else if (isInitialized && (featuredFails?.length || trendingFails?.length)) {
      console.log('✅ Successfully loaded data from database');
      setUseFallbackData(false);
      setShowInitializationError(false);
    }
  }, [featuredError, trendingError, featuredFails, trendingFails, isInitialized, useFallbackData]);

  // Convert sample data to match expected format
  const convertSampleToDatabase = (sampleFails: any[]) => {
    return sampleFails.map(fail => ({
      id: fail.id,
      title: fail.title,
      description: fail.description,
      category: fail.category || 'General',
      image_url: fail.imageUrl,
      likes: fail.likes,
      comments: fail.comments || 0,
      shares: fail.shares || 0,
      viral_score: fail.likes || 0,
      created_at: fail.date,
      status: 'approved'
    }));
  };

  // Get data (either from database or fallback)
  const displayFeaturedFails = useFallbackData 
    ? convertSampleToDatabase(getFeaturedFails())
    : featuredFails;

  const displayTrendingFails = useFallbackData 
    ? convertSampleToDatabase(getAllFails().slice(0, 8))
    : trendingFails;

  const isLoading = !useFallbackData && (featuredLoading || trendingLoading);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log('🎯 Index render state:', {
    isInitialized,
    useFallbackData,
    isLoading,
    initError,
    showInitializationError,
    featuredFails: displayFeaturedFails?.length || 0,
    trendingFails: displayTrendingFails?.length || 0
  });

  const handleRetryInitialization = () => {
    setShowInitializationError(false);
    initializeData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Initialization Error Alert */}
          {showInitializationError && initError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  <strong>Database initialization failed:</strong> {initError}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetryInitialization}
                  className="ml-4"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <QuickActions />
          <FeaturedFails fails={displayFeaturedFails} isLoading={isLoading} />
          <TrendingSection fails={displayTrendingFails} isLoading={isLoading} />
        </div>
        
        {/* Fallback Data Notice */}
        {useFallbackData && (
          <div className="container mx-auto px-4 pb-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Currently displaying sample content. Database initialization in progress.</p>
              {initError && (
                <p className="text-destructive mt-1">
                  Error: {initError} - Check the console for details.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
      
    </div>
  );
};

export default Index;
