# Adding Slots Game Type

This document explains how to add the Slots game type to your existing Casino Boys database.

## For New Databases

If you're setting up a fresh database, just run the main schema file:

```bash
npm run db:setup
```

The `slots` game type is already included in the schema.

## For Existing Databases

If you already have a database running, you need to add the `slots` value to the existing `game_type` enum.

### Step 1: Run Migration SQL

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste this SQL:

```sql
-- Add 'slots' to the existing game_type enum
ALTER TYPE game_type ADD VALUE IF NOT EXISTS 'slots';

-- Verify the change
SELECT enum_range(NULL::game_type);
```

5. Click **Run** (or press Ctrl/Cmd + Enter)

You should see the output showing all game types including 'slots':
```
{blackjack,poker,ultimate-poker,roulette,slots}
```

### Step 2: Verify in Your App

1. Restart your Next.js development server (if running):
   ```bash
   npm run dev
   ```

2. Open the app and click the **+ button** to add a transaction

3. You should now see **5 game options** instead of 4:
   - 🃏 Blackjack
   - ♠️ Poker
   - ♦️ Ultimate Poker
   - 🎡 Roulette
   - 🎰 **Slots** (NEW!)

### Step 3: Test It

1. Select an active session
2. Choose **Slots** as the game
3. Enter an amount (win or loss)
4. Add the transaction
5. Check the dashboard - slots transactions should appear with the 🎰 emoji and amber color

## Game Details

**Slots Game Configuration:**
- **Label**: Slots
- **Emoji**: 🎰
- **Color**: Amber (#f59e0b)

## Troubleshooting

### Error: "type game_type already has value slots"

This means the value was already added. You can ignore this error.

### Error: "invalid input value for enum game_type"

This means the migration hasn't been applied yet. Run the SQL script above.

### Slots not showing in the UI

1. Make sure you've restarted your dev server
2. Clear your browser cache
3. Check that the migration SQL ran successfully

## Rolling Back (if needed)

PostgreSQL doesn't support removing enum values directly. If you need to roll back:

1. This is complex and usually not recommended
2. You would need to:
   - Remove all transactions with game='slots'
   - Drop and recreate the enum
   - Recreate all affected tables

It's easier to just leave the value in the enum even if you don't use it.

