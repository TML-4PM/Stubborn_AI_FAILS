-- ============================================================================
-- PHASE 1: FIX CRITICAL DATABASE RLS POLICIES
-- ============================================================================

-- ============================================================================
-- PHASE 1.1: Clean up oopsies RLS policies
-- ============================================================================

-- Drop all problematic policies that reference auth.users
DROP POLICY IF EXISTS "Allow updating own and admin oopsies" ON public.oopsies;
DROP POLICY IF EXISTS "Allow viewing approved and system oopsies" ON public.oopsies;
DROP POLICY IF EXISTS "Admins can manage all oopsies" ON public.oopsies;

-- Drop overlapping SELECT policies
DROP POLICY IF EXISTS "Users can view their own oopsies" ON public.oopsies;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.oopsies;

-- Add missing UPDATE policy for regular users
CREATE POLICY "Users can update own oopsies"
ON public.oopsies FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add SELECT policy for users to view their own content
CREATE POLICY "Users can view own content"
ON public.oopsies FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ============================================================================
-- PHASE 1.2: Fix family_members infinite recursion
-- ============================================================================

-- Create security definer function to check family membership
CREATE OR REPLACE FUNCTION public.is_family_member(_user_id uuid, _family_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.family_members fm
    JOIN public.guardians g ON fm.guardian_id = g.id
    WHERE g.user_id = _user_id 
      AND fm.family_group_id = _family_group_id
  )
$$;

-- Create function to check if user can manage family
CREATE OR REPLACE FUNCTION public.can_manage_family(_user_id uuid, _family_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.family_members fm
    JOIN public.guardians g ON fm.guardian_id = g.id
    WHERE g.user_id = _user_id 
      AND fm.family_group_id = _family_group_id
      AND fm.role IN ('admin', 'guardian')
      AND fm.can_manage_others = true
  )
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their family members" ON public.family_members;
DROP POLICY IF EXISTS "Users can manage their family members" ON public.family_members;

-- Create new policies using security definer functions
CREATE POLICY "Users can view their family members"
ON public.family_members FOR SELECT
TO authenticated
USING (
  is_family_member(auth.uid(), family_group_id)
);

CREATE POLICY "Users can manage their family members"
ON public.family_members FOR ALL
TO authenticated
USING (
  can_manage_family(auth.uid(), family_group_id)
)
WITH CHECK (
  can_manage_family(auth.uid(), family_group_id)
);