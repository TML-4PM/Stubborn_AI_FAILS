/**
 * Development Bypass Utility
 * 
 * Provides a centralized flag for bypassing authentication checks during development.
 * This is safe because actual security is enforced server-side via RLS policies.
 * 
 * Set VITE_ADMIN_BYPASS=true in .env to enable admin bypass in any environment.
 */

export const DEV_BYPASS = 
  (import.meta.env.DEV === true) || 
  String(import.meta.env.VITE_ADMIN_BYPASS).toLowerCase() === 'true';

export const ENABLE_TEST_LAUNCHER = 
  DEV_BYPASS || 
  String(import.meta.env.VITE_ENABLE_TEST_LAUNCHER).toLowerCase() === 'true';
