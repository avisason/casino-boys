# 🎰 Casino Boys - Database Setup Guide

This guide shows you **multiple ways** to set up your database tables.

## 🎯 Choose Your Method

### ⭐ Method 1: Interactive Guide (Easiest)
```bash
npm run setup
```
This displays step-by-step instructions in your terminal. Perfect for beginners!

**What it does:**
- Checks if you have `.env.local` configured
- Shows you exactly how to set up the database via Supabase UI
- No complex commands needed

---

### 🔍 Method 2: Check Database Status
```bash
npm run db:check
```
This checks what's already set up in your database.

**What it reports:**
- ✅ Which tables exist
- ❌ Which tables are missing
- 📊 How many rows each table has
- Connection status

**Example output:**
```
🎰 Casino Boys - Database Check

Checking database setup...

🔌 Checking connection to Supabase...
✅ Connected successfully

📊 Checking tables:
   ✅ profiles - exists
   ✅ sessions - exists
   ✅ transactions - exists

📊 Checking views:
   ✅ daily_balances - exists
   ✅ session_summaries - exists

📈 Database statistics:
   profiles: 5 rows
   sessions: 3 rows
   transactions: 47 rows

✅ All database tables and views are set up correctly!
```

---

### 🚀 Method 3: Automated Setup (Advanced)
```bash
npm run db:setup
```

**Requirements:**
You need to add your service role key to `.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get it from: [Supabase Dashboard](https://app.supabase.com) → Project Settings → API → `service_role` key

⚠️ **Warning:** Keep this key secret! Never commit it to git!

**What it does:**
- Automatically reads `supabase/schema.sql`
- Executes all SQL statements
- Creates all tables, views, and policies
- Reports success/failure for each step

---

### 📝 Method 4: Manual SQL (Most Reliable)

1. **Open Supabase SQL Editor:**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your project
   - Click "SQL Editor" in the left sidebar

2. **Run the Schema:**
   - Open `supabase/schema.sql` in your code editor
   - Copy all the SQL (Ctrl/Cmd + A, then Ctrl/Cmd + C)
   - Paste into Supabase SQL Editor
   - Click "Run" button

3. **Verify Success:**
   - You should see "Success. No rows returned"
   - Check the Tables tab to see your new tables

---

### 🌱 Method 5: Add Sample Data
```bash
npm run db:seed
```

This shows you how to add test data to your database for development.

**What it provides:**
- Sample session structures
- Sample transaction examples
- SQL templates you can modify
- Instructions for creating test data

---

## 📋 What Gets Created

When you run the database setup, these objects are created:

### Tables
| Table | Description |
|-------|-------------|
| **profiles** | User accounts and profile information |
| **sessions** | Casino trip sessions with location and date |
| **transactions** | Individual game transactions (wins/losses) |

### Views
| View | Description |
|------|-------------|
| **daily_balances** | Aggregated daily totals per user |
| **session_summaries** | Session stats with player leaderboards |

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies for read/write access
- ✅ Automatic timestamp updates
- ✅ Data validation constraints

---

## 🔧 Setup Workflow

### First Time Setup (Recommended Steps)

**Step 1:** Create your Supabase project
```bash
# Go to supabase.com and create a new project
# Wait ~2 minutes for it to initialize
```

**Step 2:** Configure environment variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your credentials
# Get them from: Supabase Dashboard → Settings → API
```

**Step 3:** Check your setup
```bash
npm run db:check
```
This will tell you if tables are missing.

**Step 4:** Create the tables

**Option A** (Easiest): Follow the interactive guide
```bash
npm run setup
```

**Option B**: Run SQL manually in Supabase SQL Editor
- Copy contents of `supabase/schema.sql`
- Paste in SQL Editor
- Click Run

**Step 5:** Verify everything works
```bash
npm run db:check
```
You should see all ✅ green checkmarks!

**Step 6:** Start the app
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🐛 Troubleshooting

### Error: "Missing Supabase credentials"
**Solution:** Create `.env.local` file with:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### Error: "relation does not exist"
**Solution:** Tables not created yet. Run:
```bash
npm run setup
```
Then follow the instructions to run SQL.

### Error: "permission denied"
**Solution:** You're using anon key for admin operations. Either:
1. Use Method 4 (Manual SQL) - most reliable
2. Add service role key to `.env.local` for automated setup

### Tables exist but app doesn't work
**Solution:** Check Row Level Security policies:
```bash
npm run db:check
```
If tables exist but you can't read/write data, the policies might not be set up. Re-run the full schema.

---

## 📊 Database Schema Overview

```
┌─────────────┐
│  profiles   │  ← User accounts (extends Supabase auth.users)
└──────┬──────┘
       │
       │ 1:N
       ↓
┌─────────────┐
│  sessions   │  ← Casino trips (name, location, date)
└──────┬──────┘
       │
       │ 1:N
       ↓
┌──────────────┐
│ transactions │  ← Game plays (game type, amount, notes)
└──────────────┘
       │
       │ aggregates to
       ↓
┌──────────────────┐
│ daily_balances   │  ← View: Daily totals per user
└──────────────────┘

┌───────────────────┐
│ session_summaries │  ← View: Session stats & leaderboards
└───────────────────┘
```

---

## 🎮 Quick Start Commands

```bash
# Check if database is set up
npm run db:check

# Get setup instructions
npm run setup

# Verify connection and tables
npm run db:check

# Start the app
npm run dev
```

---

## 🔒 Security Best Practices

✅ **DO:**
- Use anon key for client-side operations
- Keep service role key in `.env.local` (not committed)
- Use RLS policies for data access control
- Verify policies are enabled with `npm run db:check`

❌ **DON'T:**
- Commit `.env.local` to git
- Share your service role key
- Disable Row Level Security
- Use service role key in client-side code

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **SQL Schema:** `supabase/schema.sql`
- **Script Docs:** `scripts/README.md`
- **Quick Start:** `QUICKSTART.md`

---

## 🎯 Summary

**Fastest method:** `npm run setup` (follow instructions)

**Most reliable:** Manual SQL via Supabase SQL Editor

**For checking:** `npm run db:check`

**For automation:** `npm run db:setup` (requires service role key)

Choose the method that works best for you! 🚀

