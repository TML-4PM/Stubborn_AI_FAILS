-- =====================================================
-- SECURITY FIX: Update existing RLS policies
-- =====================================================

-- Drop and recreate policies for user_roles if they exist
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- FIX: Secure profiles table with proper RLS
-- =====================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view limited public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create tiered access policies for profiles
CREATE POLICY "Users can view their own complete profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view limited public profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FIX: Add RLS policies to admin-protected tables
-- =====================================================

-- oopsies table - add admin-only moderation
DROP POLICY IF EXISTS "Admins can manage all content" ON public.oopsies;
CREATE POLICY "Admins can manage all content"
  ON public.oopsies FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- moderation_logs - admin only
DROP POLICY IF EXISTS "Admin only access to moderation logs" ON public.moderation_logs;
CREATE POLICY "Admin only access to moderation logs"
  ON public.moderation_logs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- site_audits - admin only
DROP POLICY IF EXISTS "Admins can view site audits" ON public.site_audits;
DROP POLICY IF EXISTS "Admins can create site audits" ON public.site_audits;
CREATE POLICY "Admins can view site audits"
  ON public.site_audits FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create site audits"
  ON public.site_audits FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- content_analytics - admin only
DROP POLICY IF EXISTS "Admins can view all analytics" ON public.content_analytics;
CREATE POLICY "Admins can view all analytics"
  ON public.content_analytics FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- FIX: Assign existing admin user to admin role
-- =====================================================

-- Grant admin role to troy@augmentedhumanity.coach if exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'troy@augmentedhumanity.coach'
ON CONFLICT (user_id, role) DO NOTHING;

-- Grant admin role to first registered user as fallback
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role
FROM public.profiles
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;