export type GameType = 'blackjack' | 'poker' | 'ultimate-poker' | 'roulette' | 'slots'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  name: string
  location: string | null
  date: string
  created_by: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface Transaction {
  id: string
  user_id: string
  session_id: string
  game: GameType
  amount: number
  notes: string | null
  transaction_date: string
  created_at: string
  updated_at: string
}

export interface DailyBalance {
  user_id: string
  transaction_date: string
  daily_total: number
  transaction_count: number
  game_breakdown: Record<GameType, number>
}

export interface Budget {
  id: string
  user_id: string
  period_type: 'weekly' | 'monthly'
  amount: number
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SessionSummary {
  session_id: string
  name: string
  location: string | null
  date: string
  is_active: boolean
  player_count: number
  total_transactions: number
  total_amount: number
  players: Array<{
    user_id: string
    full_name: string | null
    email: string
    total: number
  }>
}

export const GAME_LABELS: Record<GameType, string> = {
  'blackjack': 'Blackjack',
  'poker': 'Poker',
  'ultimate-poker': 'Ultimate Poker',
  'roulette': 'Roulette',
  'slots': 'Slots'
}

export const GAME_COLORS: Record<GameType, string> = {
  'blackjack': '#ef4444', // red
  'poker': '#3b82f6', // blue
  'ultimate-poker': '#8b5cf6', // purple
  'roulette': '#10b981', // green
  'slots': '#f59e0b' // amber
}

export const GAME_EMOJIS: Record<GameType, string> = {
  'blackjack': '🃏',
  'poker': '♠️',
  'ultimate-poker': '♦️',
  'roulette': '🎡',
  'slots': '🎰'
}

