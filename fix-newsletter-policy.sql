-- Fix Newsletter Subscription Policy
-- This fixes the RLS policy for newsletter_subscribers to allow public INSERT

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

-- Create policy that allows anyone (authenticated or anonymous) to insert
-- This is safe because we only allow inserting email and name, no sensitive data
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Verify the policy was created
-- You can check in Supabase Dashboard > Database > Policies

