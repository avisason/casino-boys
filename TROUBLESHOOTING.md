# 🔧 Troubleshooting Guide

## Common Database Setup Issues

### ❌ Error: "column 'amount' does not exist"

**Full Error:**
```
ERROR: 42703: column "amount" does not exist
LINE 115: SUM(amount) as daily_total,
```

**Cause:** This happens when:
1. SQL statements are executed out of order
2. Views are created before their dependent tables
3. The transactions table wasn't fully created before creating views

**Solution:**

#### Option 1: Use Supabase SQL Editor (Recommended)

1. **Open Supabase SQL Editor:**
   - Go to https://app.supabase.com
   - Select your project
   - Click "SQL Editor" in the left sidebar

2. **Run the complete schema at once:**
   ```bash
   # Copy ALL contents of supabase/schema.sql
   # Paste into SQL Editor
   # Click "Run"
   ```
   
   This ensures all statements execute in the correct order.

3. **Verify:**
   ```bash
   npm run db:check
   ```

#### Option 2: Drop and Recreate

If you have partial tables, drop them first:

```sql
-- In Supabase SQL Editor, run this first:
DROP VIEW IF EXISTS session_summaries;
DROP VIEW IF EXISTS daily_balances;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS game_type CASCADE;
```

Then run the full `supabase/schema.sql` again.

#### Option 3: Create Tables Manually in Order

If you need to run statements separately:

1. **First:** Create the enum type
```sql
CREATE TYPE game_type AS ENUM ('blackjack', 'poker', 'ultimate-poker', 'roulette');
```

2. **Second:** Create profiles table
```sql
-- Copy from schema.sql lines 4-25
```

3. **Third:** Create sessions table
```sql
-- Copy from schema.sql lines 27-51
```

4. **Fourth:** Create transactions table
```sql
-- Copy from schema.sql lines 56-81
```

5. **Fifth:** Create indexes
```sql
-- Copy from schema.sql lines 83-89
```

6. **Sixth:** Create functions and triggers
```sql
-- Copy from schema.sql lines 91-108
```

7. **Finally:** Create views
```sql
-- Copy from schema.sql lines 110-155
```

---

### ❌ Error: "type 'game_type' already exists"

**Solution:** The enum already exists. Either:

1. Skip the enum creation line
2. Or drop and recreate:
```sql
DROP TYPE IF EXISTS game_type CASCADE;
CREATE TYPE game_type AS ENUM ('blackjack', 'poker', 'ultimate-poker', 'roulette');
```

---

### ❌ Error: "relation 'transactions' already exists"

**Cause:** Table partially created from previous run.

**Solution:**
```sql
-- Drop and recreate
DROP TABLE IF EXISTS transactions CASCADE;
-- Then run the full schema.sql
```

---

### ❌ Error: "Missing Supabase credentials"

**Solution:** Create `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get credentials from: Supabase Dashboard → Project Settings → API

---

### ❌ Error: "permission denied for table"

**Cause:** Row Level Security (RLS) policies not set up correctly.

**Solution:**

1. **Make sure RLS is enabled:**
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
```

2. **Recreate policies:**
   Run the complete schema.sql which includes all policies.

3. **Verify policies exist:**
   - Go to Supabase Dashboard
   - Click "Database" → "Policies"
   - Check each table has policies

---

### ❌ Error: "relation 'profiles' does not exist"

**Cause:** Tables not created yet or created in wrong schema.

**Solution:**

1. **Check if tables exist:**
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **If no tables, run full schema:**
   Copy and run all of `supabase/schema.sql`

3. **Verify:**
   ```bash
   npm run db:check
   ```

---

### ❌ Error: Cannot read properties of null (reading 'id')

**Cause:** User not authenticated or profile not created.

**Solution:**

1. **Check authentication:**
   - Log out and log back in
   - Check Supabase Dashboard → Authentication → Users

2. **Manually create profile:**
```sql
-- Get your user ID from Authentication → Users
INSERT INTO profiles (id, email, full_name, avatar_url)
VALUES (
  'your-user-id-here',
  'your-email@example.com',
  'Your Name',
  null
);
```

---

## Database Check Commands

### Check what exists:
```bash
npm run db:check
```

### Check specific table:
```sql
-- In Supabase SQL Editor
SELECT * FROM information_schema.tables 
WHERE table_name IN ('profiles', 'sessions', 'transactions');
```

### Check views:
```sql
SELECT * FROM information_schema.views 
WHERE table_name IN ('daily_balances', 'session_summaries');
```

### Check columns in transactions:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'transactions';
```

### Check RLS policies:
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'sessions', 'transactions');
```

---

## Fresh Start (Nuclear Option)

If everything is broken and you want to start fresh:

### Step 1: Drop Everything
```sql
-- In Supabase SQL Editor, run:
DROP VIEW IF EXISTS session_summaries;
DROP VIEW IF EXISTS daily_balances;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS game_type CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

### Step 2: Run Full Schema
1. Copy ALL contents of `supabase/schema.sql`
2. Paste into Supabase SQL Editor
3. Click "Run"
4. Wait for "Success. No rows returned"

### Step 3: Verify
```bash
npm run db:check
```

Should show all green ✅ checkmarks!

---

## Best Practices

1. ✅ **Always use Supabase SQL Editor for schema changes**
   - Most reliable method
   - Runs all statements in correct order
   - Provides clear error messages

2. ✅ **Run complete schema at once**
   - Don't split into multiple runs
   - Copy the entire schema.sql file
   - Execute as one statement

3. ✅ **Use npm run db:check frequently**
   - Verify after each change
   - Check before starting app
   - Catch issues early

4. ✅ **Keep schema.sql as source of truth**
   - Don't make manual changes
   - Update schema.sql if you change database
   - Version control your schema

5. ✅ **Test with fresh database**
   - Drop and recreate periodically
   - Ensures schema works from scratch
   - Catches missing dependencies

---

## Still Having Issues?

1. **Check Supabase logs:**
   - Dashboard → Logs
   - Look for detailed error messages

2. **Verify environment:**
   ```bash
   # Check Node version (need 18+)
   node --version
   
   # Check if env vars loaded
   node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
   ```

3. **Try the check script:**
   ```bash
   npm run db:check
   ```
   This gives detailed info about what's missing.

4. **Manual verification:**
   - Go to Supabase Dashboard
   - Click "Table Editor"
   - Visually verify tables exist

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Column doesn't exist | Run full schema.sql in SQL Editor |
| Type already exists | Use `DROP TYPE IF EXISTS` first |
| Table already exists | Use `DROP TABLE IF EXISTS` first |
| Permission denied | Check RLS policies are set up |
| Missing credentials | Create .env.local with Supabase keys |
| Can't connect | Verify SUPABASE_URL in .env.local |

---

**Remember:** The most reliable method is always to run the complete `supabase/schema.sql` in the Supabase SQL Editor! 🎰

