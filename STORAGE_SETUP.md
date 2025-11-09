# Supabase Storage Setup for Profile Pictures

This guide explains how to set up Supabase Storage for profile picture uploads.

## Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Enable (so profile pictures are publicly accessible)
   - **File size limit**: `2097152` (2MB in bytes)
   - **Allowed MIME types**: Leave empty or add: `image/jpeg,image/png,image/gif,image/webp`
5. Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up policies for security:

### Policy 1: Public Read Access
This allows anyone to view profile pictures.

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Policy 2: Authenticated Upload
This allows authenticated users to upload their own profile pictures.

```sql
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 3: Users Can Update Their Own Avatars
This allows users to update/replace their own profile pictures.

```sql
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 4: Users Can Delete Their Own Avatars
This allows users to delete their own profile pictures.

```sql
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 3: Apply Policies via Dashboard

1. In your Supabase dashboard, go to **Storage** > **Policies**
2. Select the `avatars` bucket
3. Click **New policy**
4. For each policy above:
   - Choose the operation type (SELECT, INSERT, UPDATE, or DELETE)
   - Choose target roles (public for SELECT, authenticated for others)
   - Add the policy using the SQL editor
5. Click **Review** and then **Save policy**

## Alternative: Quick Setup via SQL Editor

You can also run all policies at once using the SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste all four policy statements above
4. Click **Run**

## Step 4: Test the Setup

1. Start your Next.js development server: `npm run dev`
2. Navigate to Settings page
3. Try uploading a profile picture
4. The image should upload successfully and display immediately

## Troubleshooting

### Error: "new row violates row-level security policy"
- Make sure the storage policies are correctly set up
- Verify the bucket name is exactly `avatars`
- Check that you're authenticated when uploading

### Error: "The resource already exists"
- The file name already exists. The app handles this with `upsert: true`
- This shouldn't happen with the random file naming, but if it does, just try again

### Images Not Loading
- Make sure you've configured `next.config.ts` to allow images from Supabase
- Check that the bucket is set to **public**
- Verify the image URL in your browser's network tab

### Upload Size Limit
- The app limits uploads to 2MB
- You can adjust this in `components/settings-form.tsx` (line ~78)
- Also adjust the bucket size limit in Supabase Storage settings

## Security Notes

- Profile pictures are stored in a **public bucket**, meaning anyone with the URL can view them
- Only authenticated users can upload images
- Users can only modify their own profile pictures
- File names include the user ID to prevent conflicts and enable ownership checking
- The app validates file types and sizes on the client side for better UX

