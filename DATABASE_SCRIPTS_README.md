# 🎰 Database Setup Scripts - Complete Guide

## What I Created For You

I've created a comprehensive set of database setup scripts to make your life easier!

### 📜 Scripts Created

1. **`scripts/setup-database-simple.ts`** ⭐ (Recommended)
   - Shows clear step-by-step instructions
   - Previews the SQL schema
   - Guides you through Supabase SQL Editor
   - **Run with:** `npm run setup`

2. **`scripts/check-database.ts`** 🔍
   - Checks if all tables exist
   - Shows row counts
   - Verifies connection
   - **Run with:** `npm run db:check`

3. **`scripts/seed-sample-data.ts`** 🌱
   - Shows how to add test data
   - Provides SQL templates
   - **Run with:** `npm run db:seed`

4. **`scripts/setup-database.ts`** (Advanced - requires service key)
   - Automated setup (use with caution)
   - Needs SUPABASE_SERVICE_ROLE_KEY

### 📚 Documentation Created

1. **`TROUBLESHOOTING.md`** 🔧
   - Solutions for common errors
   - Specific fix for "column does not exist" error
   - Step-by-step troubleshooting

2. **`DATABASE_SETUP.md`** 📖
   - Complete setup guide
   - Multiple methods explained
   - Best practices

3. **`COMMANDS.md`** ⚡
   - Quick command reference
   - All npm scripts listed
   - Common workflows

4. **`DATABASE_SCRIPTS_README.md`** 📋 (this file)
   - Overview of all scripts
   - How to use them

---

## 🎯 How To Use

### First Time Setup (Start Here!)

```bash
# Step 1: Run the setup guide
npm run setup

# Step 2: Follow the instructions it shows you
# (Go to Supabase SQL Editor and run the schema.sql)

# Step 3: Verify everything is set up
npm run db:check

# Step 4: Start your app!
npm run dev
```

### If You Get Errors

```bash
# Check what's wrong
npm run db:check

# Read the troubleshooting guide
# See: TROUBLESHOOTING.md

# For "column does not exist" error:
# 1. Drop existing objects in Supabase SQL Editor
# 2. Run the complete schema.sql again
```

---

## 🔍 Script Details

### `npm run setup` (Recommended for Everyone)

**What it does:**
- ✅ Checks if schema.sql exists
- ✅ Shows you the file path
- ✅ Displays first 20 lines as preview
- ✅ Lists what will be created
- ✅ Gives step-by-step instructions

**When to use:**
- First time setup
- When you need clear instructions
- When automated scripts fail
- When you prefer visual guidance

**Example output:**
```
🎰 Casino Boys - Database Setup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP-BY-STEP INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  Open Supabase SQL Editor:
    👉 https://app.supabase.com
    → Select your project
    → Click "SQL Editor" in left sidebar
    
...
```

---

### `npm run db:check` (Use This Frequently!)

**What it does:**
- ✅ Connects to your Supabase database
- ✅ Checks if profiles table exists
- ✅ Checks if sessions table exists
- ✅ Checks if transactions table exists
- ✅ Checks if daily_balances view exists
- ✅ Checks if session_summaries view exists
- ✅ Shows row counts for each table

**When to use:**
- After running schema.sql
- When app doesn't work
- To verify database state
- Before starting development
- After making changes

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

### `npm run db:seed` (For Testing)

**What it does:**
- ✅ Shows sample data structure
- ✅ Provides SQL templates
- ✅ Explains how to add test data
- ✅ Shows example transactions

**When to use:**
- After basic setup is complete
- When you want test data
- For development/testing
- To understand data structure

---

## 🚨 Fixing Common Errors

### Error: "column 'amount' does not exist"

**Cause:** SQL executed out of order

**Fix:**
1. Go to Supabase SQL Editor
2. Run this cleanup SQL:
```sql
DROP VIEW IF EXISTS session_summaries;
DROP VIEW IF EXISTS daily_balances;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS game_type CASCADE;
```
3. Copy **ALL** of `supabase/schema.sql`
4. Paste and run in SQL Editor
5. Run `npm run db:check` to verify

**See:** `TROUBLESHOOTING.md` for detailed guide

---

### Error: "Missing Supabase credentials"

**Fix:** Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get from: Supabase Dashboard → Settings → API

---

## 📋 Complete Workflow

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with Supabase credentials
# (Copy from Supabase Dashboard → Settings → API)

# 3. Run setup guide
npm run setup

# 4. Open Supabase SQL Editor
# https://app.supabase.com → SQL Editor

# 5. Copy ALL of supabase/schema.sql

# 6. Paste into SQL Editor and run

# 7. Verify setup
npm run db:check
# Should see all ✅ green checkmarks

# 8. Start app
npm run dev

# 9. Open http://localhost:3000
```

### After Git Pull (Team Setup)

```bash
# 1. Update dependencies
npm install

# 2. Check if database needs updates
npm run db:check

# 3. If tables missing, run setup
npm run setup
# (Follow instructions to run schema.sql)

# 4. Start developing
npm run dev
```

### When Things Break

```bash
# 1. Check status
npm run db:check

# 2. Read error messages

# 3. Check troubleshooting guide
# See: TROUBLESHOOTING.md

# 4. Try fresh start:
# - Drop all tables in Supabase SQL Editor
# - Run complete schema.sql again
# - Verify with: npm run db:check
```

---

## 🎓 Best Practices

### ✅ DO:
- Use `npm run setup` for guidance
- Run `npm run db:check` frequently
- Run complete schema.sql in one go
- Use Supabase SQL Editor for schema changes
- Keep .env.local out of version control

### ❌ DON'T:
- Try to run SQL statements separately
- Use automated scripts without service key
- Manually create tables one by one
- Commit .env.local to git
- Skip verification (db:check)

---

## 📊 What Gets Created

When you run `supabase/schema.sql`:

### Tables (3)
- **profiles**: User accounts (extends Supabase auth.users)
- **sessions**: Casino trip sessions (name, location, date)
- **transactions**: Game plays (game type, amount, notes)

### Views (2)
- **daily_balances**: Daily totals per user (for calendar)
- **session_summaries**: Session stats with leaderboards

### Security
- Row Level Security (RLS) enabled on all tables
- Policies for read/write access
- Automatic timestamp updates
- Foreign key constraints

### Indexes (6)
- User ID lookup
- Session ID lookup
- Date range queries
- Game type filtering
- Active sessions
- Optimized joins

---

## 🆘 Getting More Help

1. **Setup Issues**: See `DATABASE_SETUP.md`
2. **Errors**: See `TROUBLESHOOTING.md`
3. **Commands**: See `COMMANDS.md`
4. **Quick Start**: See `QUICKSTART.md`
5. **Full Docs**: See `README.md`

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run setup` | Show setup instructions |
| `npm run db:check` | Verify database |
| `npm run db:seed` | See sample data guide |
| `npm run dev` | Start app |

---

## 🎯 TL;DR (Too Long; Didn't Read)

**Simplest way to set up database:**

1. `npm run setup` → Read the instructions
2. Go to Supabase SQL Editor
3. Copy ALL of `supabase/schema.sql`
4. Paste and run
5. `npm run db:check` → Verify ✅
6. `npm run dev` → Start coding! 🎲

**That's it!** 🎰

