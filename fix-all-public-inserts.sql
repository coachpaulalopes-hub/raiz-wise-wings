-- Fix All Public INSERT Policies
-- Run this SQL in Supabase Dashboard > SQL Editor to fix newsletter and contact form submissions

-- ============================================
-- Fix Newsletter Subscribers Policy
-- ============================================
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- Fix Contact Messages Policy  
-- ============================================
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- Verification
-- ============================================
-- After running this, test the forms:
-- 1. Newsletter subscription should work
-- 2. Contact form submission should work

