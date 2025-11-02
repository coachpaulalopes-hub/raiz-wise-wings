# Security Setup Guide

This document explains how to set up the security features after applying the security fixes migration.

## Overview

The security fixes implement:
- ✅ Proper Supabase Authentication (replacing hardcoded password)
- ✅ Role-Based Access Control (RBAC) with admin roles
- ✅ Comprehensive Row Level Security (RLS) policies
- ✅ Input validation using Zod schemas
- ✅ Length limits and sanitization on all forms

## Step 1: Run the Migration

First, apply the security migration to your Supabase database:

```bash
# If using Supabase CLI
supabase migration up

# Or apply the migration file directly in your Supabase dashboard
# Go to: SQL Editor > New Query > Paste migration content > Run
```

## Step 2: Create an Admin User

You need to create an admin user in Supabase Auth and assign them the admin role.

### Option A: Using Supabase Dashboard (Recommended)

1. **Create the user in Supabase Auth:**
   - Go to your Supabase Dashboard
   - Navigate to **Authentication** > **Users**
   - Click **Add User** or **Invite User**
   - Enter the email and password for your admin account
   - Note the User ID (UUID) that's created

2. **Assign Admin Role:**
   - Go to **SQL Editor** in Supabase Dashboard
   - Run the following SQL, replacing `<USER_ID>` with the UUID from step 1:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<USER_ID>', 'admin');
```

### Option B: Using Supabase CLI

1. **Create user via CLI:**
```bash
supabase auth users create --email admin@example.com --password your-secure-password
```

2. **Get the user ID:**
```bash
supabase auth users list
```

3. **Assign admin role via SQL:**
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<USER_ID>', 'admin');
```

## Step 3: Test the Setup

1. **Test Admin Login:**
   - Navigate to `/admin` on your website
   - Login with the admin credentials you created
   - You should be able to access the admin panel

2. **Test Security:**
   - Try accessing `/admin` without logging in (should show login form)
   - Try logging in with a non-admin user (should be denied)
   - Try creating blog posts, viewing messages, etc. (should work for admins)

## Security Features Implemented

### 1. Authentication
- **Before:** Hardcoded password "admin123" in client-side code
- **After:** Proper Supabase Auth with email/password authentication
- Admin role verification happens on both client and server side

### 2. Database Policies

#### Blog Posts (`blog_posts`)
- ✅ Public can SELECT published posts only
- ✅ Admins can SELECT all posts (published and unpublished)
- ✅ Only admins can INSERT, UPDATE, or DELETE posts

#### Contact Messages (`contact_messages`)
- ✅ Anyone can INSERT (public contact form)
- ✅ Only admins can SELECT or UPDATE messages

#### Newsletter Subscribers (`newsletter_subscribers`)
- ✅ Anyone can INSERT (public newsletter form)
- ✅ Only admins can SELECT or UPDATE subscribers

### 3. Input Validation

All forms now have:
- **Length limits** to prevent oversized submissions
- **Format validation** (email, phone, URLs)
- **Content sanitization** (trimming, lowercasing emails)
- **Required field checks**

#### Contact Form
- Name: 1-100 characters
- Email: Valid email, max 255 characters
- Phone: Optional, max 20 characters, numeric format only
- Message: 10-2000 characters

#### Newsletter Form
- Name: 1-100 characters
- Email: Valid email, max 255 characters

#### Blog Post Form
- Title: 1-200 characters
- Excerpt: 1-500 characters
- Content: 1-50,000 characters
- Cover Image: Valid URL (optional)

## Troubleshooting

### "Access denied" after login
- Verify the user has an admin role in `user_roles` table
- Check that `is_admin()` function is working correctly
- Ensure RLS policies are properly applied

### Migration errors
- Make sure you're running migrations in order
- Check that the previous migration completed successfully
- Verify you have proper permissions on the Supabase project

### Forms not submitting
- Check browser console for validation errors
- Verify Supabase policies allow INSERT for public users (contact/newsletter)
- Ensure RLS policies are enabled on tables

## Next Steps

Consider implementing:
1. **Password reset functionality** for admin users
2. **Multi-factor authentication (MFA)** for extra security
3. **Audit logging** for admin actions
4. **Rate limiting** on public forms to prevent spam
5. **Content sanitization** for HTML blog content (prevent XSS)
6. **File upload restrictions** if you add image uploads

## Important Notes

⚠️ **After deploying these changes:**
- The old hardcoded password authentication will no longer work
- You MUST create an admin user and assign them the admin role
- Existing sessions will be invalidated

🔒 **Security Best Practices:**
- Use strong, unique passwords for admin accounts
- Consider using a password manager
- Enable 2FA in Supabase Dashboard for your admin account
- Regularly review admin users in `user_roles` table
- Keep Supabase dependencies up to date

