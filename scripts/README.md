# Database Setup Scripts

This folder contains helpful scripts for setting up and managing your Casino Boys database.

## 🚀 Quick Start

### Option 1: Simple Setup (Recommended)
```bash
npm run setup
```
This will show you step-by-step instructions for setting up the database through the Supabase web interface.

### Option 2: Automated Check
```bash
npm run db:check
```
Checks if all required tables and views exist in your database.

### Option 3: Manual SQL
1. Open [Supabase SQL Editor](https://app.supabase.com)
2. Copy contents of `supabase/schema.sql`
3. Paste and run in SQL Editor

## 📜 Available Scripts

### `npm run setup`
Displays interactive setup instructions. Perfect for first-time setup.

### `npm run db:check`
Checks your database setup and reports:
- ✅ Which tables exist
- ❌ Which tables are missing
- 📊 Row counts for each table

### `npm run db:setup`
*Note: Requires SUPABASE_SERVICE_ROLE_KEY in .env.local*

Attempts to automatically set up the database by running the schema SQL.

### `npm run db:seed`
Shows instructions for adding sample data for testing.

## 🔧 Prerequisites

All scripts require a `.env.local` file with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

The automated setup script additionally requires:
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📋 What Gets Created

### Tables
- **profiles**: User information
- **sessions**: Casino trip sessions
- **transactions**: Individual game transactions

### Views
- **daily_balances**: Aggregated daily totals per user
- **session_summaries**: Session statistics with player breakdowns

### Security
- Row Level Security (RLS) policies on all tables
- Automatic timestamp triggers
- Data validation constraints

## 🐛 Troubleshooting

### "Missing Supabase credentials"
Make sure your `.env.local` file exists and contains the required variables.

### "Table does not exist"
Run the SQL manually in Supabase SQL Editor:
1. Copy `supabase/schema.sql`
2. Paste in SQL Editor
3. Click Run

### "Permission denied"
You may need the service role key for automated setup. Get it from:
Project Settings > API > service_role key (keep this secret!)

## 🎯 Recommended Workflow

1. **First Time Setup:**
   ```bash
   npm run setup
   ```
   Follow the instructions to run SQL in Supabase

2. **Verify Setup:**
   ```bash
   npm run db:check
   ```
   Confirm all tables exist

3. **Start Developing:**
   ```bash
   npm run dev
   ```
   Your database is ready!

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Keep service role key secret (it bypasses RLS)
- Use anon key for client-side operations
- Service role key only needed for admin scripts

## 📚 More Help

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- See `QUICKSTART.md` for full setup guide

