# Admin User Setup Guide

## ⚠️ Security Warning

**NEVER commit the service role key to version control!** 

The service role key has full database access and bypasses all Row Level Security policies. It should only be used:
- Server-side scripts (like this setup script)
- Supabase Edge Functions (with proper security)
- One-time setup tasks

## Quick Setup

### Option 1: Using the Setup Script (Easiest)

1. **Make sure you've run the security migration first:**
   ```bash
   # Apply the migration in Supabase Dashboard > SQL Editor
   # Or using Supabase CLI:
   supabase migration up
   ```

2. **Edit `setup-admin.js`** and update:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (already set)

3. **Run the setup script:**
   ```bash
   npm run setup-admin
   ```

4. **Follow the prompts:**
   - Enter the admin email address
   - Enter a secure password (min 6 characters)
   - The script will create the user and assign admin role

5. **Login to /admin** with the credentials you just created

### Option 2: Manual Setup via Supabase Dashboard

1. **Create the user:**
   - Go to Supabase Dashboard > Authentication > Users
   - Click "Add User" or "Invite User"
   - Enter email and password
   - Copy the User ID (UUID)

2. **Assign admin role:**
   - Go to SQL Editor in Supabase Dashboard
   - Run this SQL (replace `<USER_ID>` with the UUID from step 1):
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('<USER_ID>', 'admin');
   ```

3. **Verify the setup:**
   - Go to `/admin` on your website
   - Login with the credentials
   - You should have full admin access

## Verifying the Setup

After setup, verify everything works:

1. **Test Admin Login:**
   - Navigate to `/admin`
   - Login with your admin credentials
   - You should see the admin panel

2. **Test Permissions:**
   - Try creating a blog post (should work)
   - Try viewing contact messages (should work)
   - Try viewing newsletter subscribers (should work)

3. **Test Security:**
   - Try accessing `/admin` without login (should show login form)
   - Try logging in with a non-admin user (should be denied)

## Troubleshooting

### "Access denied" after login
- Verify the user has an admin role: 
  ```sql
  SELECT * FROM public.user_roles WHERE user_id = '<USER_ID>';
  ```
- Check that the `is_admin()` function exists and works correctly

### Migration errors
- Ensure the security migration (`20251103000000_security_fixes.sql`) was applied
- Check that tables and functions were created correctly

### Script errors
- Verify your Supabase URL is correct
- Check that the service role key is valid
- Ensure Node.js is installed and you have the `@supabase/supabase-js` package

## Adding More Admins

To add additional admin users:

1. **Run the setup script again** with a different email
2. **Or manually:**
   - Create user in Supabase Auth Dashboard
   - Insert into `user_roles` table:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('<NEW_USER_ID>', 'admin');
   ```

## Removing Admin Access

To remove admin access from a user:

```sql
DELETE FROM public.user_roles 
WHERE user_id = '<USER_ID>' AND role = 'admin';
```

## Security Best Practices

1. **Never commit service role keys** to version control
2. **Use strong passwords** for admin accounts
3. **Enable 2FA** on your Supabase account
4. **Regularly review** admin users in `user_roles` table
5. **Rotate service role keys** if they're ever exposed
6. **Delete the setup script** after initial setup (or keep it secure for future use)

## Next Steps

After setting up your admin user:

1. ✅ Test all admin functionality
2. ✅ Review security policies in Supabase Dashboard
3. ✅ Set up password reset functionality (if needed)
4. ✅ Consider implementing MFA for admin accounts
5. ✅ Document admin procedures for your team

