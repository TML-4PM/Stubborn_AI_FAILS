
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LinkHealthResult {
  url: string;
  isHealthy: boolean;
  statusCode?: number;
  responseTime?: number;
  error?: string;
}

export const useLinkHealthChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkedUrls, setCheckedUrls] = useState<Map<string, LinkHealthResult>>(new Map());

  const checkLinkHealth = useCallback(async (url: string): Promise<LinkHealthResult> => {
    // Check if we already have cached result
    const cached = checkedUrls.get(url);
    if (cached) {
      return cached;
    }

    setIsChecking(true);

    try {
      // First check our database for recent health check
      const { data: existingCheck } = await supabase
        .from('link_health')
        .select('*')
        .eq('url', url)
        .gte('last_checked', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // 5 minutes ago
        .single();

      if (existingCheck) {
        const result: LinkHealthResult = {
          url,
          isHealthy: existingCheck.is_healthy,
          statusCode: existingCheck.status_code,
          responseTime: existingCheck.response_time,
          error: existingCheck.error_message
        };
        setCheckedUrls(prev => new Map(prev).set(url, result));
        return result;
      }

      // Perform fresh health check via Edge Function
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors' // This will limit what we can check but avoids CORS issues
      });
      const responseTime = Date.now() - startTime;

      const result: LinkHealthResult = {
        url,
        isHealthy: response.ok,
        statusCode: response.status,
        responseTime
      };

      // Store result in database
      await supabase.rpc('update_link_health', {
        check_url: url,
        status_code_param: response.status,
        response_time_param: responseTime,
        error_message_param: response.ok ? null : `HTTP ${response.status}`
      });

      setCheckedUrls(prev => new Map(prev).set(url, result));
      return result;

    } catch (error) {
      const result: LinkHealthResult = {
        url,
        isHealthy: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      // Store error result
      await supabase.rpc('update_link_health', {
        check_url: url,
        status_code_param: 0,
        response_time_param: 0,
        error_message_param: result.error
      });

      setCheckedUrls(prev => new Map(prev).set(url, result));
      return result;
    } finally {
      setIsChecking(false);
    }
  }, [checkedUrls]);

  const checkMultipleLinks = useCallback(async (urls: string[]): Promise<LinkHealthResult[]> => {
    const results = await Promise.all(urls.map(checkLinkHealth));
    return results;
  }, [checkLinkHealth]);

  const clearCache = useCallback(() => {
    setCheckedUrls(new Map());
  }, []);

  return {
    checkLinkHealth,
    checkMultipleLinks,
    clearCache,
    isChecking,
    checkedUrls: Array.from(checkedUrls.values())
  };
};
