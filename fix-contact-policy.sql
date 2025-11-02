-- Fix Contact Messages Policy
-- This ensures contact messages can be submitted by anyone

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Create policy that allows anyone (authenticated or anonymous) to insert
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

