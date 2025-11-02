-- FIX COMPLETE: Newsletter and Contact Forms RLS Policies
-- Copy this ENTIRE file and paste into Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"

-- ============================================
-- FIX 1: Newsletter Subscribers - Allow Public INSERT
-- ============================================

-- First, drop ALL existing policies on newsletter_subscribers to start fresh
DO $$
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
    DROP POLICY IF EXISTS "Only admins can view newsletter subscribers" ON public.newsletter_subscribers;
    DROP POLICY IF EXISTS "Only admins can update newsletter subscribers" ON public.newsletter_subscribers;
END $$;

-- Create INSERT policy for public (anyone can subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Create SELECT policy for admins only
CREATE POLICY "Only admins can view newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Create UPDATE policy for admins only
CREATE POLICY "Only admins can update newsletter subscribers"
ON public.newsletter_subscribers
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================
-- FIX 2: Contact Messages - Allow Public INSERT
-- ============================================

-- First, drop ALL existing policies on contact_messages to start fresh
DO $$
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Only admins can update contact messages" ON public.contact_messages;
END $$;

-- Create INSERT policy for public (anyone can submit contact form)
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Create SELECT policy for admins only
CREATE POLICY "Only admins can view contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Create UPDATE policy for admins only
CREATE POLICY "Only admins can update contact messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this:
-- 1. Newsletter subscription form should work
-- 2. Contact form should work
-- 3. Only admins can view the data in admin panel

-- Test the forms on your website now!

