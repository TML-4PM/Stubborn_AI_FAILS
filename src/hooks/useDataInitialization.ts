
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { initialAIFails } from '@/data/initialAIFails';
import { useToast } from './use-toast';

export const useDataInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const initializeData = async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      console.log('Starting data initialization...');
      
      // Check if data already exists
      const { data: existingOopsies, error: checkError } = await supabase
        .from('oopsies')
        .select('id')
        .limit(1);

      if (checkError) {
        console.error('Error checking existing data:', checkError);
        throw new Error(`Database check failed: ${checkError.message}`);
      }

      if (existingOopsies && existingOopsies.length > 0) {
        console.log('Data already initialized');
        setIsInitialized(true);
        setIsInitializing(false);
        return;
      }

      console.log('No existing data found, inserting initial AI fails...');

      // Insert initial AI fails data - remove id field to let database generate UUIDs
      const oopsiesData = initialAIFails.map(fail => ({
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

      console.log(`Attempting to insert ${oopsiesData.length} AI fails...`);
      console.log('Sample data item:', oopsiesData[0]);

      const { data: insertedData, error: oopsiesError } = await supabase
        .from('oopsies')
        .insert(oopsiesData)
        .select('id, title');

      if (oopsiesError) {
        console.error('Error inserting oopsies:', oopsiesError);
        console.error('Error details:', {
          message: oopsiesError.message,
          details: oopsiesError.details,
          hint: oopsiesError.hint,
          code: oopsiesError.code
        });
        throw new Error(`Failed to insert AI fails: ${oopsiesError.message}. Details: ${oopsiesError.details || 'No details'}`);
      }

      console.log('Successfully inserted AI fails:', insertedData?.length || 0, 'records');

      // Initialize Printify settings
      const { error: printifyError } = await supabase
        .from('printify_settings')
        .insert({
          api_token_configured: false,
          sync_enabled: false
        });

      if (printifyError && !printifyError.message.includes('duplicate')) {
        console.warn('Error initializing Printify settings:', printifyError);
        // Don't throw here, as this is not critical for basic functionality
      }

      console.log('Initial data loaded successfully');
      setIsInitialized(true);
      
      toast({
        title: "Data Initialized",
        description: `Successfully loaded ${insertedData?.length || 0} sample AI fails.`
      });

    } catch (error) {
      console.error('Error initializing data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Initialization Failed",
        description: errorMessage,
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
    error,
    initializeData
  };
};
