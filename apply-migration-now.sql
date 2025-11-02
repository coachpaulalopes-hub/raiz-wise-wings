-- SECURITY FIXES MIGRATION
-- Copy and paste this ENTIRE file into Supabase Dashboard > SQL Editor > New Query
-- Then click "Run"

-- Step 1: Create admin role checking function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get the email of the authenticated user
  user_email := (SELECT email FROM auth.users WHERE id = auth.uid());
  
  -- Check if the user is an admin (hardcoded for now, can be moved to a table later)
  -- TODO: Replace with your actual admin email address
  -- For now, we'll use a configurable approach via a user_roles table
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- Step 2: Create user_roles table to manage admin access
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable Row Level Security on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Only service role can insert/update roles (handled via Supabase dashboard or Edge Functions)
-- For now, we'll allow admins to manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Step 3: Add proper RLS policies for blog_posts
-- Only create policies if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') THEN
    -- Drop the existing SELECT policy to replace it with a more comprehensive one
    DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;

    -- Policy: Public can SELECT published posts, admins can SELECT all
    CREATE POLICY "Public can view published, admins can view all blog posts"
    ON public.blog_posts
    FOR SELECT
    USING (public.is_admin() OR published = true);

    -- Policy: Only admins can INSERT blog posts
    CREATE POLICY "Only admins can create blog posts"
    ON public.blog_posts
    FOR INSERT
    WITH CHECK (public.is_admin());

    -- Policy: Only admins can UPDATE blog posts
    CREATE POLICY "Only admins can update blog posts"
    ON public.blog_posts
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

    -- Policy: Only admins can DELETE blog posts
    CREATE POLICY "Only admins can delete blog posts"
    ON public.blog_posts
    FOR DELETE
    USING (public.is_admin());
  END IF;
END $$;

-- Note: The SELECT policy above already covers both admins and public access

-- Step 4: Add proper RLS policies for contact_messages
-- Only create policies if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages') THEN
    -- Policy: Anyone can INSERT contact messages (public form)
    DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
    CREATE POLICY "Anyone can submit contact messages"
    ON public.contact_messages
    FOR INSERT
    TO public
    WITH CHECK (true);

    -- Policy: Only admins can SELECT contact messages
    DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;
    CREATE POLICY "Only admins can view contact messages"
    ON public.contact_messages
    FOR SELECT
    USING (public.is_admin());

    -- Policy: Only admins can UPDATE contact messages (mark as read)
    DROP POLICY IF EXISTS "Only admins can update contact messages" ON public.contact_messages;
    CREATE POLICY "Only admins can update contact messages"
    ON public.contact_messages
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
  END IF;
END $$;

-- Step 5: Add proper RLS policies for newsletter_subscribers
-- Only create policies if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'newsletter_subscribers') THEN
    -- Policy: Anyone can INSERT newsletter subscriptions (public form)
    DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
    CREATE POLICY "Anyone can subscribe to newsletter"
    ON public.newsletter_subscribers
    FOR INSERT
    TO public
    WITH CHECK (true);

    -- Policy: Only admins can SELECT newsletter subscribers
    DROP POLICY IF EXISTS "Only admins can view newsletter subscribers" ON public.newsletter_subscribers;
    CREATE POLICY "Only admins can view newsletter subscribers"
    ON public.newsletter_subscribers
    FOR SELECT
    USING (public.is_admin());

    -- Policy: Only admins can UPDATE newsletter subscribers
    DROP POLICY IF EXISTS "Only admins can update newsletter subscribers" ON public.newsletter_subscribers;
    CREATE POLICY "Only admins can update newsletter subscribers"
    ON public.newsletter_subscribers
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
  END IF;
END $$;

-- Step 6: Assign admin role to existing user
-- This will assign admin role to the user created by the script
INSERT INTO public.user_roles (user_id, role)
VALUES ('c0ec443d-73a5-466a-a0b1-10784b74aefe', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Migration complete!
-- The user coachpaulalopes@gmail.com now has admin access

