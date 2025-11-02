# 🎰 Casino Boys - Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name, database password, and region
4. Wait for your project to be created (~2 minutes)

## Step 3: Configure Your Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase/schema.sql` in this project
3. Copy all the SQL code
4. Paste it into the Supabase SQL Editor
5. Click **Run** to create all tables and views

## Step 4: Get Your API Credentials

1. In Supabase, go to **Project Settings** (gear icon) > **API**
2. You'll see two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (long string starting with `eyJ...`)

## Step 5: Create Environment File

Create a file called `.env.local` in the root of your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual credentials from Step 4.

## Step 6: Enable Google Login (Recommended)

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** and toggle it on
3. Follow the instructions to get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or use existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase
5. Save!

## Step 7: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 8: First Login

1. Click "Continue with Google" or enter your email
2. Complete the authentication
3. You'll be redirected to the dashboard

## Step 9: Create Your First Session

1. Click on the **Sessions** tab in the bottom nav
2. Click the **+** button in the top-right
3. Enter:
   - **Session Name**: "Vegas Trip 2024" (or whatever you want)
   - **Location**: "Bellagio Casino" (optional)
   - **Date**: Select today's date
4. Click **Create Session**

## Step 10: Add Your First Transaction

1. Click the floating **+** button (purple/pink circle)
2. Select your session
3. Choose a game (Blackjack, Poker, etc.)
4. Enter the amount:
   - **Positive** for wins (e.g., `150` = won $150)
   - **Negative** for losses (e.g., `-50` = lost $50)
5. Add optional notes
6. Click **Add Transaction**

## 🎉 You're All Set!

Now explore the app:

- **Dashboard**: See your overall performance with beautiful charts
- **Calendar**: View your daily wins and losses on a calendar
- **Sessions**: Manage casino trips and see leaderboards
- **Settings**: Update your profile

## 📱 Pro Tips

- **Quick amounts**: Use the quick amount buttons (-$50, -$100, +$100, +$500) when adding transactions
- **Color coding**: Green = wins, Red = losses
- **Shared experience**: Invite friends to join the same Supabase project to share sessions!
- **Mobile friendly**: Add to your home screen for the best mobile experience

## 🆘 Troubleshooting

### "No active sessions" when adding transaction
- Go to Sessions tab and create a session first

### Can't log in
- Check that your environment variables are correct
- Make sure you've run the schema.sql in Supabase
- Check Supabase dashboard for authentication errors

### Charts not showing
- You need to add some transactions first
- Make sure transactions have different dates for trend chart

### Still having issues?
- Check the browser console for errors
- Check Supabase logs in the dashboard
- Verify your database tables were created correctly

## 🎰 Ready to Track!

Have fun tracking your casino adventures! Remember to gamble responsibly! 🎲

