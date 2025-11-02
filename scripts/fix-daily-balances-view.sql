-- Fix the daily_balances view to correctly calculate daily_total
DROP VIEW IF EXISTS daily_balances;

CREATE OR REPLACE VIEW daily_balances AS
SELECT 
  user_id,
  transaction_date,
  SUM(game_total) as daily_total,
  COUNT(*) as transaction_count,
  jsonb_object_agg(game, game_total) as game_breakdown
FROM (
  SELECT 
    user_id,
    transaction_date,
    game,
    SUM(amount) as game_total
  FROM transactions
  GROUP BY user_id, transaction_date, game
) as game_totals
GROUP BY user_id, transaction_date;
