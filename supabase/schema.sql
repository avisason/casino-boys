-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Casino sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions are viewable by everyone" ON sessions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create sessions" ON sessions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update any session" ON sessions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete sessions they created" ON sessions
  FOR DELETE USING (auth.uid() = created_by);

-- Game types enum
CREATE TYPE game_type AS ENUM ('blackjack', 'poker', 'ultimate-poker', 'roulette');

-- Transactions table (tracks all game plays)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  game game_type NOT NULL,
  amount DECIMAL(10, 2) NOT NULL, -- positive for wins, negative for losses
  notes TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transactions are viewable by everyone" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create transactions" ON transactions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_session_id ON transactions(session_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_game ON transactions(game);
CREATE INDEX idx_sessions_date ON sessions(date);
CREATE INDEX idx_sessions_active ON sessions(is_active);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for user daily balances
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

-- View for session summaries
CREATE OR REPLACE VIEW session_summaries AS
SELECT 
  s.id as session_id,
  s.name,
  s.location,
  s.date,
  s.is_active,
  COUNT(DISTINCT t.user_id) as player_count,
  COUNT(t.id) as total_transactions,
  COALESCE(SUM(t.amount), 0) as total_amount,
  jsonb_agg(DISTINCT jsonb_build_object(
    'user_id', p.id,
    'full_name', p.full_name,
    'email', p.email,
    'total', user_totals.user_total
  )) as players
FROM sessions s
LEFT JOIN transactions t ON s.id = t.session_id
LEFT JOIN profiles p ON t.user_id = p.id
LEFT JOIN (
  SELECT session_id, user_id, SUM(amount) as user_total
  FROM transactions
  GROUP BY session_id, user_id
) user_totals ON s.id = user_totals.session_id AND t.user_id = user_totals.user_id
GROUP BY s.id, s.name, s.location, s.date, s.is_active;

