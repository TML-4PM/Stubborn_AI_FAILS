import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Invisible runner that triggers discovery to populate data without any UI
const AutoDataRunner = () => {
  useEffect(() => {
    // Avoid running multiple times per session
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('autoDiscoveryRan') === '1') return;

    const run = async () => {
      try {
        // Trigger discovery for multiple platforms in parallel
        await Promise.all([
          supabase.functions.invoke('discover-ai-fails', { body: { platform: 'reddit' } }),
          supabase.functions.invoke('discover-ai-fails', { body: { platform: 'hackernews' } }),
        ]);
      } catch (err) {
        console.error('Auto discovery error:', err);
      } finally {
        sessionStorage.setItem('autoDiscoveryRan', '1');
      }
    };

    run();
  }, []);

  return null;
};

export default AutoDataRunner;
