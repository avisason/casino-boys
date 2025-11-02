/**
 * Seed Sample Data Script
 * 
 * This script adds sample data to your database for testing.
 * Run with: npx tsx scripts/seed-sample-data.ts
 * 
 * WARNING: This will add test data to your database!
 */

import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample data
const sampleUsers = [
  { email: 'player1@example.com', full_name: 'Alex Johnson' },
  { email: 'player2@example.com', full_name: 'Sam Smith' },
  { email: 'player3@example.com', full_name: 'Jordan Lee' },
]

const sampleSessions = [
  {
    name: 'Vegas Weekend 2024',
    location: 'Bellagio Casino',
    date: new Date().toISOString().split('T')[0],
    is_active: true,
  },
  {
    name: 'Atlantic City Trip',
    location: 'Borgata Hotel',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    is_active: false,
  },
]

const games = ['blackjack', 'poker', 'ultimate-poker', 'roulette'] as const

function randomAmount() {
  // Random amount between -500 and 500
  return Math.floor(Math.random() * 1000) - 500
}

function randomGame() {
  return games[Math.floor(Math.random() * games.length)]
}

async function seedData() {
  console.log('🎰 Casino Boys - Seed Sample Data\n')
  
  try {
    // Note: In production, you'd need to create actual user accounts
    // For this demo, we'll just show the structure
    
    console.log('⚠️  Note: This script requires manual user creation in Supabase Auth')
    console.log('          The following data structure is provided as reference:\n')
    
    console.log('📝 Sample Sessions:')
    sampleSessions.forEach((session, i) => {
      console.log(`   ${i + 1}. ${session.name} at ${session.location}`)
    })
    
    console.log('\n📝 Sample Transaction Structure:')
    console.log('   - Random games: Blackjack, Poker, Ultimate Poker, Roulette')
    console.log('   - Random amounts: -$500 to +$500')
    console.log('   - Distributed across multiple days\n')
    
    console.log('To add sample data:')
    console.log('1. Create test users in Supabase Auth Dashboard')
    console.log('2. Log in as each user in the app')
    console.log('3. Create sessions using the UI')
    console.log('4. Add transactions using the Quick Add button\n')
    
    console.log('Or run this SQL in Supabase SQL Editor after creating users:\n')
    console.log('-- Create a sample session')
    console.log(`INSERT INTO sessions (name, location, date, created_by, is_active)`)
    console.log(`VALUES ('Vegas Weekend 2024', 'Bellagio Casino', CURRENT_DATE, 'YOUR_USER_ID', true);`)
    console.log('\n-- Add sample transactions')
    console.log(`INSERT INTO transactions (user_id, session_id, game, amount, transaction_date)`)
    console.log(`VALUES `)
    console.log(`  ('YOUR_USER_ID', 'SESSION_ID', 'blackjack', 150, CURRENT_DATE),`)
    console.log(`  ('YOUR_USER_ID', 'SESSION_ID', 'poker', -75, CURRENT_DATE),`)
    console.log(`  ('YOUR_USER_ID', 'SESSION_ID', 'roulette', 250, CURRENT_DATE);`)
    
    console.log('\n✨ Sample data structure provided!')
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

seedData().catch(console.error)

