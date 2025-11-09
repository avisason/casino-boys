# Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
# Get these values from your Supabase project settings
# https://app.supabase.com/project/_/settings/api

NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Go to Project Settings > API
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Key** (anon/public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Setting Up the Database

After creating your Supabase project:

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the entire contents of `supabase/schema.sql`
3. Paste it into the SQL Editor
4. Run the query to create all tables, views, and policies

## Setting Up Storage for Profile Pictures

To enable profile picture uploads:

1. Follow the steps in `STORAGE_SETUP.md` to create the `avatars` storage bucket
2. Set up the required storage policies for security
3. This is required for the profile picture upload feature to work

## Enabling Google OAuth (Optional but Recommended)

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable the Google provider
3. Follow the instructions to set up Google OAuth credentials
4. Add your site URL to the authorized redirect URLs
5. For local development, add `http://localhost:3000/auth/callback`

## Testing Your Setup

After setting up your environment variables and database:

```bash
npm run dev
```

Then navigate to `http://localhost:3000` and try logging in!

