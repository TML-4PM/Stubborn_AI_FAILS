
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { initialAIFails } from '@/data/initialAIFails';
import { useToast } from './use-toast';
import { useErrorTracking } from './useErrorTracking';

export const useDataInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializationProgress, setInitializationProgress] = useState<string>('');
  const { toast } = useToast();
  const { logError } = useErrorTracking();

  const updateProgress = (message: string) => {
    console.log(`📊 Initialization Progress: ${message}`);
    setInitializationProgress(message);
  };

  const initializeData = async () => {
    setIsInitializing(true);
    setError(null);
    updateProgress('Starting initialization...');
    
    try {
      updateProgress('Checking authentication status...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(`Authentication check failed: ${authError.message}`);
      }

      console.log('🔐 Auth status:', user ? 'Authenticated' : 'Anonymous');
      
      updateProgress('Checking existing data...');
      console.log('🔍 Checking if data already exists...');
      
      // Check if data already exists
      const { data: existingOopsies, error: checkError } = await supabase
        .from('oopsies')
        .select('id')
        .limit(1);

      if (checkError) {
        console.error('❌ Error checking existing data:', checkError);
        // Don't fail completely on RLS permission errors - just log and continue
        console.warn('⚠️ Could not check existing data, proceeding with initialization attempt...');
        updateProgress('Warning: Could not check existing data, proceeding...');
      }

      if (!checkError && existingOopsies && existingOopsies.length > 0) {
        console.log('✅ Data already initialized');
        updateProgress('Data already exists');
        setIsInitialized(true);
        setIsInitializing(false);
        return;
      }

      updateProgress('Preparing sample data...');
      console.log('📝 No existing data found, preparing initial AI fails...');

      // Validate initialAIFails data
      if (!initialAIFails || !Array.isArray(initialAIFails) || initialAIFails.length === 0) {
        throw new Error('Initial AI fails data is invalid or empty');
      }

      console.log(`📊 Found ${initialAIFails.length} initial AI fails to insert`);

      // Prepare oopsies data with explicit system user assignment
      const oopsiesData = initialAIFails.map((fail, index) => {
        console.log(`🔧 Preparing fail ${index + 1}: ${fail.title}`);
        
        const data = {
          title: fail.title || `AI Fail ${index + 1}`,
          description: fail.description || 'No description provided',
          category: fail.category || 'General',
          image_url: fail.image_url || null,
          user_id: null, // Explicitly set to null for system content
          status: 'approved', // Set directly to approved
          likes: Math.max(0, fail.likes || 0),
          comments: Math.max(0, fail.comments || 0),
          shares: Math.max(0, fail.shares || 0),
          viral_score: Math.max(0, fail.viral_score || 0),
          source_platform: fail.source_platform || 'system',
          source_url: fail.source_url || null,
          auto_generated: true, // Mark as auto-generated
          confidence_score: Math.min(1, Math.max(0, fail.confidence_score || 0.95)),
          review_status: 'approved' // Pre-approve system content
        };
        
        console.log(`✅ Prepared oopsie data for: ${data.title}`);
        return data;
      });

      updateProgress(`Inserting ${oopsiesData.length} AI fails...`);
      console.log(`🚀 Attempting to insert ${oopsiesData.length} AI fails...`);

      // Insert in smaller batches to avoid potential issues
      const batchSize = 2; // Smaller batches for better error tracking
      let insertedCount = 0;
      
      for (let i = 0; i < oopsiesData.length; i += batchSize) {
        const batch = oopsiesData.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(oopsiesData.length / batchSize);
        
        updateProgress(`Inserting batch ${batchNumber}/${totalBatches}...`);
        console.log(`📦 Inserting batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);
        
        try {
          const { data: batchResult, error: batchError } = await supabase
            .from('oopsies')
            .insert(batch)
            .select('id, title, status');

          if (batchError) {
            console.error(`❌ Error inserting batch ${batchNumber}:`, batchError);
            logError(new Error(batchError.message), `Batch Insert ${batchNumber}`, user?.id);
            throw new Error(`Failed to insert batch ${batchNumber}: ${batchError.message}`);
          }

          insertedCount += batchResult?.length || 0;
          console.log(`✅ Successfully inserted batch ${batchNumber}, total so far: ${insertedCount}`);
          
          // Small delay between batches to prevent overwhelming the database
          if (i + batchSize < oopsiesData.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (batchErr) {
          console.error(`💥 Batch ${batchNumber} failed:`, batchErr);
          throw batchErr;
        }
      }

      updateProgress('Finalizing initialization...');
      console.log(`🎉 Successfully inserted all ${insertedCount} AI fails`);

      // Initialize Printify settings (non-critical)
      try {
        updateProgress('Setting up Printify integration...');
        const { error: printifyError } = await supabase
          .from('printify_settings')
          .insert({
            api_token_configured: false,
            sync_enabled: false
          });

        if (printifyError && !printifyError.message.includes('duplicate')) {
          console.warn('⚠️ Warning: Could not initialize Printify settings:', printifyError);
        } else {
          console.log('✅ Printify settings initialized');
        }
      } catch (printifyErr) {
        console.warn('⚠️ Non-critical: Printify settings initialization failed:', printifyErr);
      }

      updateProgress('Initialization completed successfully!');
      console.log('🏁 Data initialization completed successfully');
      setIsInitialized(true);
      
      toast({
        title: "Data Initialized",
        description: `Successfully loaded ${insertedCount} sample AI fails.`
      });

    } catch (error) {
      console.error('💥 Error during data initialization:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during initialization';
      setError(errorMessage);
      logError(error instanceof Error ? error : new Error(String(error)), 'Data Initialization');
      updateProgress(`Failed: ${errorMessage}`);
      
      toast({
        title: "Initialization Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Check initialization status on mount
  useEffect(() => {
    const checkInitializationStatus = async () => {
      try {
        updateProgress('Checking initialization status...');
        
        // Skip database check in preview/dev environments to avoid RLS errors
        const isDev = import.meta.env.DEV || window.location.hostname.includes('lovableproject.com');
        if (isDev) {
          console.log('🔧 Dev mode: Skipping database initialization check');
          setIsInitialized(true);
          updateProgress('Dev mode active');
          return;
        }
        
        const { data, error } = await supabase
          .from('oopsies')
          .select('id')
          .limit(1);

        if (error) {
          console.error('❌ Error checking initialization status:', error);
          // In case of permission errors, assume initialized to prevent blocking
          setIsInitialized(true);
          return;
        }

        const alreadyInitialized = data && data.length > 0;
        setIsInitialized(alreadyInitialized);
        
        if (alreadyInitialized) {
          updateProgress('Already initialized');
          console.log('✅ Database already initialized');
        } else {
          updateProgress('Ready to initialize');
          console.log('⏳ Database ready for initialization');
        }
      } catch (err) {
        console.error('💥 Failed to check initialization status:', err);
        updateProgress('Status check failed');
        // Assume initialized to prevent blocking the app
        setIsInitialized(true);
      }
    };

    checkInitializationStatus();
  }, []);

  return {
    isInitializing,
    isInitialized,
    error,
    initializationProgress,
    initializeData
  };
};
