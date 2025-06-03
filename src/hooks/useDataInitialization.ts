
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { initialAIFails } from '@/data/initialAIFails';
import { useToast } from './use-toast';

export const useDataInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const initializeData = async () => {
    setIsInitializing(true);
    
    try {
      // Check if data already exists
      const { data: existingOopsies } = await supabase
        .from('oopsies')
        .select('id')
        .limit(1);

      if (existingOopsies && existingOopsies.length > 0) {
        console.log('Data already initialized');
        setIsInitialized(true);
        setIsInitializing(false);
        return;
      }

      // Insert initial AI fails data
      const oopsiesData = initialAIFails.map(fail => ({
        id: fail.id,
        title: fail.title,
        description: fail.description,
        category: fail.category,
        image_url: fail.image_url,
        user_id: null, // System generated content
        status: fail.status,
        likes: fail.likes,
        comments: fail.comments,
        shares: fail.shares,
        viral_score: fail.viral_score,
        source_platform: fail.source_platform,
        source_url: fail.source_url || null,
        auto_generated: fail.auto_generated,
        confidence_score: fail.confidence_score,
        review_status: 'approved'
      }));

      const { error: oopsiesError } = await supabase
        .from('oopsies')
        .insert(oopsiesData);

      if (oopsiesError) {
        console.error('Error inserting oopsies:', oopsiesError);
        throw oopsiesError;
      }

      // Initialize Printify settings
      const { error: printifyError } = await supabase
        .from('printify_settings')
        .insert({
          api_token_configured: false,
          sync_enabled: false
        });

      if (printifyError && !printifyError.message.includes('duplicate')) {
        console.error('Error initializing Printify settings:', printifyError);
      }

      console.log('Initial data loaded successfully');
      setIsInitialized(true);
      
      toast({
        title: "Data Initialized",
        description: "Sample AI fails and settings have been loaded."
      });

    } catch (error) {
      console.error('Error initializing data:', error);
      toast({
        title: "Initialization Failed",
        description: "Failed to load initial data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    // Auto-initialize on first load
    initializeData();
  }, []);

  return {
    isInitializing,
    isInitialized,
    initializeData
  };
};
