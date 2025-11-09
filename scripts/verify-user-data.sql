-- Script to verify that user data is properly isolated
-- Run this in your Supabase SQL Editor to check data filtering

-- 1. Check if daily_balances view exists and shows data per user
SELECT 
  user_id,
  transaction_date,
  daily_total,
  transaction_count
FROM daily_balances
ORDER BY user_id, transaction_date DESC
LIMIT 10;

-- 2. Check transaction count per user
SELECT 
  p.full_name,
  p.email,
  COUNT(t.id) as transaction_count,
  SUM(CASE WHEN t.amount > 0 THEN t.amount ELSE 0 END) as total_wins,
  SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END) as total_losses,
  SUM(t.amount) as net_total
FROM profiles p
LEFT JOIN transactions t ON p.id = t.user_id
GROUP BY p.id, p.full_name, p.email
ORDER BY transaction_count DESC;

-- 3. Verify daily_balances is correctly grouped by user
SELECT 
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_daily_records,
  MIN(transaction_date) as earliest_date,
  MAX(transaction_date) as latest_date
FROM daily_balances;

-- 4. Check for any data leakage (should return empty if RLS is working)
-- This query should only show data for the authenticated user
SELECT 
  user_id,
  COUNT(*) as record_count
FROM transactions
GROUP BY user_id;

