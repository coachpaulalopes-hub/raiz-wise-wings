-- FIX COMPLETE: Newsletter e Contacto Forms - RLS Policies
-- Copy this ENTIRE file and paste into Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"
-- This fixes BOTH newsletter subscription and contact form submission errors

-- ============================================
-- FIX 1: Newsletter Subscribers - Allow Public INSERT
-- ============================================

-- Drop ALL existing policies on newsletter_subscribers
DO $$
BEGIN
    DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
    DROP POLICY IF EXISTS "Only admins can view newsletter subscribers" ON public.newsletter_subscribers;
    DROP POLICY IF EXISTS "Only admins can update newsletter subscribers" ON public.newsletter_subscribers;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Create INSERT policy for public (anyone can subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Create SELECT policy for admins only (if function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        CREATE POLICY "Only admins can view newsletter subscribers"
        ON public.newsletter_subscribers
        FOR SELECT
        TO authenticated
        USING (public.is_admin());
        
        CREATE POLICY "Only admins can update newsletter subscribers"
        ON public.newsletter_subscribers
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
    END IF;
END $$;

-- ============================================
-- FIX 2: Contact Messages - Allow Public INSERT
-- ============================================

-- Drop ALL existing policies on contact_messages
DO $$
BEGIN
    DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Only admins can update contact messages" ON public.contact_messages;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Create INSERT policy for public (anyone can submit contact form)
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Create SELECT policy for admins only (if function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        CREATE POLICY "Only admins can view contact messages"
        ON public.contact_messages
        FOR SELECT
        TO authenticated
        USING (public.is_admin());
        
        CREATE POLICY "Only admins can update contact messages"
        ON public.contact_messages
        FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
    END IF;
END $$;

-- ============================================
-- VERIFICATION MESSAGE
-- ============================================
-- After running this:
-- 1. Newsletter subscription form should work
-- 2. Contact form should work
-- 3. Only admins can view the data in admin panel
-- 4. Test both forms on your website

-- Success message
SELECT 'Policies created successfully! Newsletter and Contact forms should now work.' as status;

