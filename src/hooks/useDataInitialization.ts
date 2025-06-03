
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

      // Prepare oopsies data with explicit system user assignment
      const oopsiesData = initialAIFails.map(fail => {
        const data = {
          title: fail.title,
          description: fail.description,
          category: fail.category,
          image_url: fail.image_url,
          user_id: null, // Explicitly set to null for system content
          status: 'approved', // Set directly to approved
          likes: fail.likes || 0,
          comments: fail.comments || 0,
          shares: fail.shares || 0,
          viral_score: fail.viral_score || 0,
          source_platform: fail.source_platform || 'system',
          source_url: fail.source_url || null,
          auto_generated: true, // Mark as auto-generated
          confidence_score: fail.confidence_score || 0.95,
          review_status: 'approved' // Pre-approve system content
        };
        
        console.log('Prepared oopsie data:', { title: data.title, user_id: data.user_id, status: data.status });
        return data;
      });

      console.log(`Attempting to insert ${oopsiesData.length} AI fails...`);

      // Insert in smaller batches to avoid potential issues
      const batchSize = 3;
      let insertedCount = 0;
      
      for (let i = 0; i < oopsiesData.length; i += batchSize) {
        const batch = oopsiesData.slice(i, i + batchSize);
        console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(oopsiesData.length / batchSize)}...`);
        
        const { data: batchResult, error: batchError } = await supabase
          .from('oopsies')
          .insert(batch)
          .select('id, title');

        if (batchError) {
          console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, batchError);
          console.error('Batch error details:', {
            message: batchError.message,
            details: batchError.details,
            hint: batchError.hint,
            code: batchError.code
          });
          throw new Error(`Failed to insert batch: ${batchError.message}`);
        }

        insertedCount += batchResult?.length || 0;
        console.log(`Successfully inserted batch ${Math.floor(i / batchSize) + 1}, total so far: ${insertedCount}`);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Successfully inserted all ${insertedCount} AI fails`);

      // Initialize Printify settings (non-critical)
      try {
        const { error: printifyError } = await supabase
          .from('printify_settings')
          .insert({
            api_token_configured: false,
            sync_enabled: false
          });

        if (printifyError && !printifyError.message.includes('duplicate')) {
          console.warn('Warning: Could not initialize Printify settings:', printifyError);
        } else {
          console.log('Printify settings initialized');
        }
      } catch (printifyErr) {
        console.warn('Non-critical: Printify settings initialization failed:', printifyErr);
      }

      console.log('Data initialization completed successfully');
      setIsInitialized(true);
      
      toast({
        title: "Data Initialized",
        description: `Successfully loaded ${insertedCount} sample AI fails.`
      });

    } catch (error) {
      console.error('Error during data initialization:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during initialization';
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
